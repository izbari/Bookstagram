const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.messageNotification = functions.firestore
  .document('Chats/{msgId}')
  .onUpdate(async (change, context) => {
    // Get an object representing the current document
    const newMessage = change.after.data();
    const chatId = context.params.msgId;
    const sender = newMessage.messages[0].user;
    const receiver =
      sender._id == newMessage.users[0]
        ? newMessage.users[1]
        : newMessage.users[0];
    // Get the list of device notification tokens.
    const getDeviceTokensPromise = admin
      .database()
      .ref(`/users/${receiver}/notificationTokens`)
      .once('value');
    const getUserPromise = admin
      .database()
      .ref(`/users/${receiver}`)
      .once('value');

    // The snapshot to the user's tokens.
    let tokensSnapshot;
    let userSnapshot;
    // The array containing all the user's tokens.
    let tokens;

    const results = await Promise.all([getDeviceTokensPromise,getUserPromise]);
    tokensSnapshot = results[0];
    userSnapshot = results[1].val();


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
        title: `${sender.name}`,
        body: `${newMessage.messages[0].text}`,
        image: sender.avatar,
        sound: 'default',
      },
      data: {
        targetRoute: 'ChatSingleScreen',
        chatId: chatId,
        name: sender.name,
        imageUrl: sender.avatar,
        uid: newMessage.users[0],
        authData:JSON.stringify(userSnapshot),
      },
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
