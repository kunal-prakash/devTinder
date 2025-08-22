const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "John",
    lastName: "Doe",
    emailId: "john@doe.com",
    password: "pass13",
  });
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).end("Error creating user: ", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(7000, () => {
      console.log("server started on port 7000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed: ", err);
  });
