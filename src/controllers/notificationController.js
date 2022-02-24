import PushNotification from 'react-native-push-notification';
exports.configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        const {channelId, title, message, largeIconUrl} = notification;
        console.log('NOTIFICATION:', notification);
        console.log('id =>', channelId);
        createNotification(channelId);
        localNotification(notification.channelId, title, message, largeIconUrl);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };
  exports.createNotification = channel => {
    PushNotification.createChannel(
      {
        channelId: channel, // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        sound : "default",
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };
  exports.localNotification = (channel, title, message, largeIconUrl) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: channel,
      title: title,
      message: message,
      largeIconUrl: largeIconUrl,
      sound: "default",
    });
  };