# Papillon-wallet-server
Serveur Apple/Google(bientôt) Wallet pour générer des cartes pour Papillon

## Installation
> [!WARNING]  
> ```signerCert.pem``` et ```signerKey.pem``` sont à générer avec openssl et require un compte Apple developer membership

- Clonner le repo
- ```npm install```
- Copier les fichiers ```signerCert.pem``` et ```signerKey.pem``` dans le dossier ```certs```
- Créer un fichier ```.env``` à la racine du projet avec les variables suivantes:
```bash
PORT= <port>
SIGNER_KEY_PASSPHRASE = <passphrase>
```
- ```npm start```

## Routes
- ```/``` : GET -> Status du serveur
- ```/restaurant``` : POST -> Créer la carte
  - ```name``` : string
  - ```classe``` : string
  - ```qrcodenumber``` : int ou string (obligatoire)
  - ```os``` : string (obligatoire)


