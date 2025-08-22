const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("server started on port 3000");
});

app.use("/test", (req, res) => {
  res.send("test");
});

app.get("/hello", (req, res) => {
  res.send("hello");
});
