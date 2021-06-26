"use strict";
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.gqnxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const Email = require("./emailModel");

const nodemailer = require("nodemailer");

const app = express();

var currentUser = "singhprakhar0610@gmail.com";
var currentPassword = "Mkt204mkt.";
var currentUserName = "Prakhar Singh";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var port = process.env.PORT || 3000;

app.get("/composeMail", function (req, res) {
  res.render("composeMail");
});

app.post("/composeMail", function (req, res) {
  var sender = currentUser;
  // var senderPassword = currentPassword;
  const newMail = new Email({
    to: req.body.to,
    body: req.body.emailBody,
    subject: req.body.subject,
    cc: req.body.cc,
    bcc: req.body.bcc,
    from: sender,
  });

  newMail.save();
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com", // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
        user: currentUser, // generated ethereal user
        pass: currentPassword, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${currentUserName} <${currentUser}>`, // sender address
      to: `${req.body.to}`,
      cc: `${req.body.cc}`,
      bcc: `${req.body.bcc}`, // list of receivers
      subject: `${req.body.subject}`, // Subject line
      text: `${req.body.emailBody}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(res.send(error));

  res.render("home");
});

app.get("/", function (req, res) {
  res.render("home");
});

app.listen(port, function () {
  console.log("server started ");
});
