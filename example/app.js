const express = require("express");
const { cognitoMiddleware } = require("../dist/index.js");

const app = express();
const port = 9000;

const config = {
  region: "eu-west-2",
  userPoolId: "eu-west-2_0jWTqtygp",
};

app.use(cognitoMiddleware(config));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
