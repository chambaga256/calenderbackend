const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  post: String,
  surnameNow: String,
  firstNames: String,
  dob: String,
  age: String,
  gender: String,
  religion: String,
  maritalStatus: String,
  residentialAddress: String,
  town: String,
  postalAddress: String,
  telephone: String,
  email: String,
  citizenship: String,
  idNumber: String,
  homeDistrict: String,
  qualifications: Array,
  attachment: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);
