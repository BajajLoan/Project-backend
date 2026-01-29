const admin = require("./firebaseAdmin");

const sendFirebaseNotification = async ({ token, title, body }) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
  };

  await admin.messaging().send(message);
};

module.exports = sendFirebaseNotification;
