const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: {
    type: String,
  },
});

const userModel = model("User", userSchema);
module.exports = userModel;
