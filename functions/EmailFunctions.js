
 'use strict';
 const functions = require('firebase-functions');
 const nodemailer = require('nodemailer');
 
 const gmailEmail = functions.config().gmail.email;
 const gmailPassword = functions.config().gmail.password;
 const mailTransport = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: gmailEmail,
     pass: gmailPassword,
   },
 });
 

 const APP_NAME = 'Bookstagram';
 
 
 exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {

   const email = user.email; // The email of the user.
   const displayName = user.displayName; // The display name of the user.
 
   return sendWelcomeEmail(email, displayName);
 });
 
 /**
  * Send an account deleted email confirmation to users who delete their accounts.
  */
 // [START onDeleteTrigger]
 exports.sendByeEmail = functions.auth.user().onDelete((user) => {

  const email = user.email;
   const displayName = user.displayName;
 
   return sendGoodbyeEmail(email, displayName);
 });
 
 // Sends a welcome email to the given user.
 async function sendWelcomeEmail(email, displayName) {
   const mailOptions = {
     from: `${APP_NAME} <noreply@firebase.com>`,
     to: email,
   };
 
   // The user subscribed to the newsletter.
   mailOptions.subject = `Welcome to ${APP_NAME}!`;
   mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
   await mailTransport.sendMail(mailOptions);
   functions.logger.log('New welcome email sent to:', email);
   return null;
 }
 
 // Sends a goodbye email to the given user.
 async function sendGoodbyeEmail(email, displayName) {
   const mailOptions = {
     from: `${APP_NAME} <noreply@firebase.com>`,
     to: email,
   };
 
   // The user unsubscribed to the newsletter.
   mailOptions.subject = `Bye!`;
   mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
   await mailTransport.sendMail(mailOptions);
   functions.logger.log('Account deletion confirmation email sent to:', email);
   return null;
 }