const express = require("express");
const Admin = require("../models/Admin");
const { hash } = require("../utils/hash");
const AdminRouter = express.Router();
const nodemailer = require("nodemailer");
const { compareHash } = require("../utils/hash");
const { sign } = require("../utils/jwtService");

let rand, mailOptions, host, link;

let smtpTransport;

AdminRouter.post("/add", async (req, res) => {
  try {
    if (req.body.email) {
      const NewAdmin = new Admin({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        passwordHash: hash(req.body.passwordHash)
      });
      const result = await NewAdmin.save();
      console.log(result._id);
      rand = Math.floor(Math.random() * 100 + 54);
      host = req.get("host");
      link = "https://" + req.get("host") + "/verify?id=" + result._id;
      smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mdsdev29@gmail.com",
          pass: "Mdsdev29.."
        }
      });
      console.log(req.body.email);
      mailOptions = {
        from: "srinivasanmds29@gmail.com",
        to: req.body.email,
        subject: "Please confirm your Email account",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>"
      };
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
          res.end("error");
        } else {
          console.log("Message sent: " + response.message);
          res.status(200).json({
            message: "Mail send to your mail Address please verify",
            data: "hai"
          });
        }
      });
    } else {
      res.status(400).send("Invalid admin");
    }
  } catch (e) {
    res.status(500).send("Inernal Server Error");
  }
});

/////////////////verification

AdminRouter.get("/", async (req, res) => {
  try {
    const result = await Admin.findOne({ _id: req.query.id }, async function (
      err,
      doc
    ) {
      doc.isVerified = true;
      await doc.save();
    });
    if (result.email) {
      console.log(result);
      console.log("email is verified");
      res.status(200).send("<h1>Email is been Successfully verified</h1>");
      //res.redirect("/");
      // window.location = "https://dgbwp.sse.codesandbox.io/";
    } else {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  } catch (e) {
    res.status(500).send("Inernal Server Error");
  }
});

AdminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  Admin.findOne({ email: email }, function (err, user) {
    if (err) {
      return res.status(500).send({ message: err.message });
    } else if (!user) {
      return res.status(401).send({
        message:
          "The email address " +
          email +
          " is not associated with any account. please check and try again!"
      });
    } else if (!user.isVerified) {
      return res.status(401).send({
        message: "Your Email has not been verified. Please click on resend"
      });
    } else if (!compareHash(password, user.passwordHash)) {
      return res.status(401).send({ message: "Wrong Password!" });
    } else {
      const token = sign({
        sub: "admin",
        email
      });
      res.cookie("jwt", token, { httpOnly: true });
      return res.status(200).send({ message: "User successfully logged in." });
    }
  });
});
AdminRouter.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = AdminRouter;
