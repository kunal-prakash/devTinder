const mongoose = require("mongoose");
const validator = require("validator");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    lastName: String,
    emailId: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please provide a valid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password.");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: 80,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please provide a valid gender");
        }
      },
    },
    about: {
      type: String,
      maxLength: 500,
      default: "This is a default about section.",
    },
    profilePicture: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    hobbies: [String],
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);
module.exports = userModel;
