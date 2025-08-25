const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

//Signup api - POST /signup -  create a new user
app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //Enccrypt the password
    const encryptedPass = await bcrypt.hash(password, 10);

    //Creating a new instance of the User model
    const userData = {
      firstName,
      lastName,
      emailId,
      password: encryptedPass,
    };
    const user = new User(userData);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

//login api - POST /login - login a user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userData = await User.findOne({ emailId: emailId });
    console.log(userData);
    if (!userData) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      }
      res.send("Logged in successfully");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

//Get user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.findOne({ emailId: userEmail });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed api -  GET /feed - get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Delete user from the DB - DELETE /user - deletes a user by ID
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update user in DB - PATCH /user - can update partial user data(document) by ID
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // await User.findOneAndUpdate({_id: userId}, req.body);
    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true, //Ensures that the update respects the schema validation rules
    });
    //defult returnDocument: "before" which returns the document before update
    console.log(user);
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send(`Update failed: ${err.message}`);
  }
});

//Update user in DB - PATCH /user - replaces the entire user data(document) by ID
app.put("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findOneAndReplace({ _id: userId }, req.body);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//WildCard Error handling
app.use((err, req, res, next) => {
  console.error(`Error occurred at ${req.path}: `, err.message);
  res.status(500).send("Something went wrong");
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
