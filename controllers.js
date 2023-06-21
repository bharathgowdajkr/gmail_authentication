const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2Client } = require('google-auth-library');

// import open, {openApp, apps} from 'open';

require("dotenv").config();

const SCOPE = [ 'https://www.googleapis.com/auth/userinfo.email', 'https://mail.google.com'];
let codee ;

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

async function googleAuth(req, res) {
    try {
        let id = 123;

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "online",
            scope: SCOPE,
            prompt: "consent",
            state: id,
        });
        res.send(authUrl)
    } catch (e) {
        console.log("erroreeeeeeeeee", e);
        res.send(e.message);
    }
}

async function callBack(req, res) {

    // console.log("gggggggggg", req.query.state);
    // codee = req.query.state

    try {
        let tokenData = await oAuth2Client.getToken(req.query.code);
        // let tokenData = tokenData.tokens.access_token; // get Access Token

        console.log("get Access Token---",tokenData.tokens.access_token);
        codee = tokenData.tokens.access_token
        let oauth2Client = new google.auth.OAuth2();    // create new auth client
        oauth2Client.setCredentials({ access_token: tokenData.tokens.access_token });    // use the new auth client with the access_token

        let oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        let loginUserData = await oauth2.userinfo.get();    // get user info
        // console.log("data", loginData.data);    // you will find name, email, picture etc. here
        res.send({
            message: "Succuess",
            data: loginUserData.data
        })

    } catch (e) {
        console.log("erroreeeeeeeeee333333", e);
        res.send(e.message);
    }
}



async function sendMail(req, res) {
    try {

        const accessToken = await oAuth2Client.getAccessToken();

        let emailToken = accessToken.token;

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "bharath@zibtek.in",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: emailToken,
            }
        });

        // transport.on("token", (token) => {
        //     console.log("A new access token was generated");
        //     console.log("User: %s", token.user);
        //     console.log("Access Token: %s", token.accessToken);
        //     console.log("Expires: %s", new Date(token.expires));
        // });

        const mailoptions = {
            from: "bharath@zibtek.in",
            to: "ishwar@zibtek.in",
            subject: "SUB",
            text: "hello it work's  2ND"
        };

        const result = await transport.sendMail(mailoptions);
        console.log("result", result);
        res.send(result);

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

async function getInbox(req, res) {

    // console.log("inside-------",codee);
    try {
        let oauth2Client = new google.auth.OAuth2();    // create new auth client
        oauth2Client.setCredentials({ access_token: codee });    // use the new auth client with the access_token

        let gmail = google.gmail({
            auth: oauth2Client,
            version: 'v1'
        });
        const response = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
          });
      
          const messages = response.data.messages;
          console.log('Inbox messages:', messages);

          res.send({
            message: "Succuess",
            data: messages
        })

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}


module.exports = {
    sendMail,
    googleAuth,
    callBack,
    getInbox

};
