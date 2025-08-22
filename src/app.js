const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

//normal way of error handling
app.get("/user/login", (req, res) => {
  try {
    throw new Error("This is a test error");
    res.send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while login");
  }
});

app.use("/user", userAuth, (req, res) => {
  res.send("User data fetched successfully");
});

app.get("/admin/getAllUser", (req, res) => {
  res.send("All users data fetched successfully");
});

app.get("/admin/deleteAllUser", (req, res) => {
  res.send("All users deleted successfully");
});

// Error handling middleware for exceptions (Wildcard error handling)
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(`Error occured in ${req.path} :`, err.message);
    res.status(500).send("Something went wrong");
  }
});

app.listen(7000, () => {
  console.log("server started on port 7000");
});
