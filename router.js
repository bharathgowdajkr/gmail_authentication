const express = require('express');
const controllers=require('./controllers');
const router = express.Router();

router.get('/mail/send',controllers.sendMail);
router.get('/mail/auth',controllers.googleAuth);
router.get('/mail/callBack',controllers.callBack);
router.get('/mail/getInbox',controllers.getInbox);


module.exports = router;