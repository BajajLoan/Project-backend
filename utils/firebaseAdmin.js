import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = "/home/firebase/firebase-admin.json";

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
