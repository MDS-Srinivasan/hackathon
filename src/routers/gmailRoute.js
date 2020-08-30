const express = require("express");
const gmailRouter = express.Router();
const { google } = require("googleapis");
const CLIENT_ID =
  "563024353182-dbbvneevkvif33t19t92tiu3fdo1op0m.apps.googleusercontent.com";
const CLIENT_SECRET = "MV8YYjMupdueYKuskxOxf20R";
const REDIRECT_URL = "https://dgbwp.sse.codesandbox.io/auth/google/callback";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
var authed = false;
var token;

gmailRouter.get("/", (req, res) => {
  if (!authed) {
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/gmail.readonly"
    });
    console.log(url);
    res.redirect(url);
  } else {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    res.send("Logged in");
  }
});

gmailRouter.get("/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        oAuth2Client.setCredentials(tokens);
        token = tokens.access_token;
        console.log(token);
        res.cookie("token", token, { httpOnly: true });
        authed = true;
        res.redirect("/post");
      }
    });
  }
});
gmailRouter.get("/logout", async (req, res) => {
  console.log(req.cookies.token);
  await oAuth2Client.revokeToken(req.cookies.token);
  res.clearCookie("token");
  authed = false;
  res.redirect("/");
});
module.exports = gmailRouter;
