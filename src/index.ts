import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("123");
});

app.listen(4444, () => {
  console.log("Hello Express.js");
});
