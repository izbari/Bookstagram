const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.onCall = functions.firestore
  .document('meet/{chatId}')
  .onCreate(async (change, context) => {
    // Get an object representing the current document
    const chatId = context.params.chatId;

    const receiverPromise = admin.firestore().collection('Chats').doc(chatId).get();
    
    functions.logger.log(
      'receiverPromise',
      receiverPromise,
    );
   
    // const getDeviceTokensPromise = admin
    //   .database()
    //   .ref(`/users/${userId}/notificationTokens`)
    //   .once('value');

      
const result = await Promise.resolve(receiverPromise);
   const receiverData = result.data();
   functions.logger.log(
    'receiverData',
    receiverData,
  );
  const deneme = admin.auth
  .getUser();

  functions.logger.log(
    'deneme',
    deneme,
  );
    
  });
