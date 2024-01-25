const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { PKPass } = require("passkit-generator");

const certDirectory = path.resolve(process.cwd(), "cert");
const wwdr = fs.readFileSync(path.join(certDirectory, "wwdr.pem"));
const signerCert = fs.readFileSync(path.join(certDirectory, "signerCert.pem"));
const signerKey = fs.readFileSync(path.join(certDirectory, "signerKey.pem"));
const signerKeyPassphrase = process.env.SIGNER_KEY_PASSPHRASE;


async function createRestaurant(name, classe, qrcodenumber, os) {
    // Selection de l'OS
    if (os == "ios") {
        // Generer un ID unique pour le pass
        const passID = crypto
            .createHash("md5")
            .update(`${name}_${Date.now()}`)
            .digest("hex");

        // Création du pass
        const pass = await PKPass.from(
            {
                model: path.resolve(process.cwd(), "cantine.pass"),
                certificates: {
                    wwdr,
                    signerCert,
                    signerKey,
                    signerKeyPassphrase
                },
            },
            {
                serialNumber: passID,
            }
        );

        // Ajout du code QR (obligatoire)
        if (!Boolean(qrcodenumber)) {
            throw new Error("QR Code number is required");
        } else {
            pass.setBarcodes({
                message: qrcodenumber,
                format: "PKBarcodeFormatQR",
                altText: qrcodenumber
            });
        };

        // Ajout du nom et de la classe sur le pass (si renseigné)
        if (Boolean(name)) {
            pass.secondaryFields.push({
                key: "name",
                label: "Nom",
                value: name,
            });
        };

        if (Boolean(classe)) {
            pass.secondaryFields.push({
                key: "class",
                label: "Classe",
                value: classe,
                textAlignment: "PKTextAlignmentRight",
            });
        };

        return pass;
    }
    else if (os == "android") {
        console.log("OS android");
    }
    else {
        console.log("OS non reconnu");
    }
};

module.exports = createRestaurant;