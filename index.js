const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { PKPass } = require("passkit-generator");
const fastify = require("fastify")({
  logger: true,
});
require('dotenv').config()

const certDirectory = path.resolve(process.cwd(), "cert");
const wwdr = fs.readFileSync(path.join(certDirectory, "wwdr.pem"));
const signerCert = fs.readFileSync(path.join(certDirectory, "signerCert.pem"));
const signerKey = fs.readFileSync(path.join(certDirectory, "signerKey.pem"));
const signerKeyPassphrase = process.env.SIGNER_KEY_PASSPHRASE;

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ status: "ok" });
});

fastify.post("/", async (request, reply) => {
  const { name } = request.body;
  const { qrcodenumber } = request.body;
  const { classe } = request.body;

  // Feel free to use any other kind of UID here or even read an
  // existing ticket from the database and use its ID
  const passID = crypto
    .createHash("md5")
    .update(`${name}_${Date.now()}`)
    .digest("hex");

  // Create a new pass
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
      eventTicket: {},
      serialNumber: passID,
    }
  );

  // Adding some settings to be written inside pass.json
  pass.setBarcodes({
    message: qrcodenumber,
    format: "PKBarcodeFormatQR",
    altText: qrcodenumber
  });
  pass.set
  if (Boolean(name)) {
    pass.secondaryFields.push(
      {
        key: "name",
        label: "Nom",
        value: name,
      }
    );
  }

  if (Boolean(classe)) {
    pass.secondaryFields.push(
      {
        key: "class",
        label: "Classe",
        value: classe,
        textAlignment: "PKTextAlignmentRight",
      }
    );
  }

  console.log(pass);
  console.log(passID);
  console.log(name);

  reply.header("Content-Type", "application/vnd-apple.pkpass");

  reply.send(pass.getAsBuffer());
});

// Start the server
fastify.listen({ port: process.env.PORT ?? 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
