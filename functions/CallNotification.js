const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.onCall = functions.firestore
  .document('meet/{chatId}')
  .onCreate(async (change, context) => {
    // Get an object representing the current document
    const chatId = context.params.chatId;
    const {name,imageUrl,id} = change.data().offer.user;
    const receiverPromise = admin.firestore().collection('Chats').doc(chatId).get();
    
    functions.logger.log(
      'receiverPromise',
      receiverPromise,
    );
   
     const getDeviceTokensPromise = admin
       .database()
      .ref(`/users/${id}/notificationTokens`)
     .once('value');

      
const results = await Promise.all([receiverPromise,getDeviceTokensPromise]);
const receiver = results[0];
const tokensSnapshot = results[1];

   const receiverData = receiver.data();
   functions.logger.log(
    'receiverData',
    receiverData,
  );
   // Check if there are any device tokens.
   if (!tokensSnapshot.hasChildren()) {
    return functions.logger.log(
      'There are no notification tokens to send to.',
    );
  }
  functions.logger.log(
    'There are',
    tokensSnapshot.numChildren(),
    'tokens to send notifications to.',
  );
  const payload = {
    notification: {
      title: 'Bookstagram',
      body: `${name} is calling you... `,
      image: imageUrl,
      sound: 'default',
    },
    data:{
      targetRoute:'VideoCallScreen',
      chatId:chatId,
      name:name,
      imageUrl:imageUrl,
      uid:id,
    }
  };

  // Listing all tokens as an array.
  tokens = Object.keys(tokensSnapshot.val());
  // Send notifications to all tokens.
  const response = await admin.messaging().sendToDevice(tokens, payload);
  // For each message check if there was an error.
  const tokensToRemove = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      functions.logger.error(
        'Failure sending notification to',
        tokens[index],
        error,
      );
      // Cleanup the tokens who are not registered anymore.
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
    }
  });
  return Promise.all(tokensToRemove);
    
  });
