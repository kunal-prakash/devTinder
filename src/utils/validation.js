const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;
  const validator = require("validator");
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = validateSignupData;
