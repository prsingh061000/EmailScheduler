const mongoose = require("mongoose");

const emailsSchema = {
  from: String,
  to: String,
  cc: String,
  bcc: String,
  subject: String,
  body: String,
};

const Email = mongoose.model("Email", emailsSchema);

module.exports = Email;
