const admin = require("firebase-admin");
const path = require("path");

if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH missing");
}

admin.initializeApp({
  credential: admin.credential.cert(
    require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH))
  ),
});

module.exports = admin;
