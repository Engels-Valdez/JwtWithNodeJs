const express = require("express");
const { strategyToken, verifyToken } = require("./tokenManager");
const fs = require("fs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const privateKey = "adQssw5c";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, resp) => {
  return resp.json({ msj: "active!" });
});

app.get("/users", strategyToken, async (req, resp) => {
  const auth = verifyToken(req, jwt, privateKey);
  if (!auth) {
    resp.sendStatus(401);
    return;
  }

  try {
    const userList = await fs.promises.readFile("./db/data.json", "utf8");
    const listParse = JSON.parse(userList);
    const dataToResponse = {
      statusCode: 200,
      data: listParse,
      error: false,
    };
    return resp.json({ ...dataToResponse });
  } catch (error) {
    console.log("Error geting user: ", error);
    return resp.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const { pass, ...dataToJwt } = req.body;
  const token = await jwt.sign(dataToJwt, privateKey, { expiresIn: "20s" });
  res.json({ ...req.body, token });
});

app.listen(3000, () => {
  console.log("App listening...");
});
