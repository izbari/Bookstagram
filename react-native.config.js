// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    dependency: {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink
      },
    },
  },
};
