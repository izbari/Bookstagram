const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.postLike = functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (change, context) => {
    // Get an object representing the current document
    const post = change.after.data();

    const likerId = post.likes[post.likes.length-1]
   const {userId, userImageUrl, userName} = post
    // Get the list of device notification tokens.
    const getDeviceTokensPromise = admin
      .database()
      .ref(`/users/${userId}/notificationTokens`)
      .once('value');

      const getLikerDataPromise = admin
      .database()
      .ref(`/users/${likerId}`)
      .once('value');

    // The snapshot to the user's tokens.
    let tokensSnapshot;
    let likerDataSnapshot;
    // The array containing all the user's tokens.
    let tokens;

    const results = await Promise.all([getDeviceTokensPromise, getLikerDataPromise]);
    tokensSnapshot = results[0];
    likerDataSnapshot = results[1];

    functions.logger.log(
        'Liker data',
        likerDataSnapshot.val(),
      );
      const {imageUrl, name, lastName} = likerDataSnapshot.val()
    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      return functions.logger.log(
        'There  are no notification tokens to send to.',
      );
    }
   
    const payload = {
      notification: {
        title: "Bookstagram",
        body:`${name + " " + lastName}  liked your post`,
        image: imageUrl,
        sound: 'default',
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
