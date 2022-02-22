const FollowRequest = require('./FollowRequest');
const EmailFunctions = require('./EmailFunctions');
const MessageNotification= require('./MessageNotification');
exports.sendFollowerNotification = FollowRequest.sendFollowerNotification;
exports.sendWelcomeEmail = EmailFunctions.sendWelcomeEmail;
exports.sendByeEmail = EmailFunctions.sendByeEmail;
exports.messageNotification  = MessageNotification.messageNotification;
