const admin = require("firebase-admin");

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

module.exports = admin;
