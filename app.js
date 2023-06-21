const express = require("express");
const routes = require("./router");

require("dotenv").config();

const app = express();

app.use('/api', routes)

app.listen(process.env.PORT, () => {
    require('child_process').exec('start http://localhost:8000/')
    console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
    // const result=await sendMail();
    res.send("Welcome to Gmail API with NodeJS");
});