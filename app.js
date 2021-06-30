"use strict";
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Verifier = require("email-verifier");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.gqnxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const Email = require("./emailModel");

const nodemailer = require("nodemailer");

const app = express();

var currentUser = "";
var currentPassword = "";
var currentUserName = "";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var port = process.env.PORT || 3000;

let today = new Date();
today = today.toDateString();

app.get("/composeMail", function (req, res) {
  res.render("composeMail");
});

app.post("/composeMail", function (req, res) {
  var sender = currentUser;
  // var senderPassword = currentPassword;

  console.log(currentUser);
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
    const newMail = new Email({
      to: req.body.to,
      body: req.body.emailBody,
      subject: req.body.subject,
      cc: req.body.cc,
      bcc: req.body.bcc,
      from: sender,
      date: today,
    });

    newMail.save();
    res.redirect("/landingPage");
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);

  // Email.find({ from: currentUser }, function (err, foundEmails) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render("landingPage", {
  //       emails: foundEmails,
  //       userName: currentUserName,
  //     });
  //   }
  // });
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/landingPage", function (req, res) {
  Email.find({ from: currentUser }, function (err, foundEmails) {
    if (err) {
      console.log(err);
    } else {
      res.render("landingPage", {
        emails: foundEmails,
        userName: currentUserName,
      });
    }
  });
});

app.post("/login", function (req, res) {
  // let verifier = new Verifier("prsingh061000@gmail.com", "barneystinson");
  // verifier.verify(req.body.username, (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // });
  currentPassword = req.body.password;
  currentUser = req.body.username;
  currentUserName = req.body.name;

  Email.find({ from: currentUser }, function (err, foundEmails) {
    if (err) {
      console.log(err);
    } else {
      res.render("landingPage", {
        emails: foundEmails,
        userName: currentUserName,
      });
    }
  });
});

app.get("/email/:_id", function (req, res) {
  var requestedId = req.params._id;
  Email.findOne({ _id: requestedId }, function (err, foundEmail) {
    if (err) {
      console.log(err);
    } else {
      res.render("emailPage", {
        to: foundEmail.to,
        subject: foundEmail.subject,
        body: foundEmail.body,
        date: foundEmail.date,
        cc: foundEmail.cc,
        bcc: foundEmail.bcc,
      });
    }
  });
});

app.listen(port, function () {
  console.log("server started ");
});
