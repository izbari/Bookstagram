const FollowRequest = require('./FollowRequest');
const EmailFunctions = require('./EmailFunctions');
exports.sendFollowerNotification = FollowRequest.sendFollowerNotification;
exports.sendWelcomeEmail = EmailFunctions.sendWelcomeEmail;
exports.sendByeEmail = EmailFunctions.sendByeEmail;
