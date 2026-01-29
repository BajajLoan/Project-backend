// backend/firebase.js
import admin from "firebase-admin";
import serviceAccount from "/home/firebase/firebase-admin.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
