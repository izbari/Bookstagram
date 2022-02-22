const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendFollowerNotification = functions.database.ref('/users/{followerUid}/fallowing/{followedUid}')
    .onWrite(async (change, context) => {
      const followerUid = context.params.followerUid;
      const followedUid = context.params.followedUid;
      // If un-follow we exit the function.
      console.warn('followerUid', followerUid);
      if (!change.after.val()) {
        return functions.logger.log(
          'User ',
          followerUid,
          'un-followed user',
          followedUid
        );
      }
      functions.logger.log(
        'We have a new follower UID:',
        followerUid,
        'for user:',
        followedUid
      );

      // Get the list of device notification tokens.
      const getDeviceTokensPromise = admin.database()
          .ref(`/users/${followedUid}/notificationTokens`).once('value');

      // Get the follower profile.
      const getFollowerProfilePromise = admin.database()
      .ref(`/users/${followerUid}`).once('value');
      

      // The snapshot to the user's tokens.
      let tokensSnapshot;

      // The array containing all the user's tokens.
      let tokens;

      const results = await Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]);
      tokensSnapshot = results[0];
      const follower = results[1];

      // Check if there are any device tokens.
      if (!tokensSnapshot.hasChildren()) {
        return functions.logger.log(
          'There are no notification tokens to send to.'
        );
      }
      functions.logger.log(
        'There are',
        tokensSnapshot.numChildren(),
        'tokens to send notifications to.'
      );
      functions.logger.log('Fetched follower profile', follower.val());
        const {imageUrl,name,lastName} = follower.val();
      // Notification details.
      const payload = {
        notification: {
          title: 'You have a new follower!',
          body: `${name + " "+ lastName} is now following you.`,
          image: imageUrl,
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
            error
          );
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });
      return Promise.all(tokensToRemove);
    });