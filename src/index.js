require("./dbconfig/db");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
const app = express();
const postRouter = require("./routers/postsRoute");
const authorRouter = require("./routers/authorRoute");
const adminRouter = require("./routers/adminRoute");
const gmailRouter = require("./routers/gmailRoute");
app.use(bodyParser.json());
app.use(cookieParser());

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials")
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (request, response) => {
  response.status(200).render("home", {
    layout: "hero",
    title: "Home"
  });
});

app.get("/adminLogin", (request, response) => {
  response.status(200).render("adminLogin", {
    layout: "hero",
    title: "Admin Login",
    submitTarget: "/admin/login",
    submitMethod: "POST"
  });
});

app.get("/adminReg", (req, res) => {
  res.status(200).render("addAdmin", {
    layout: "hero",
    title: "Add Admin",
    action: "/admin/add",
    method: "POST"
  });
});
app.get("/post", (req, res) => {
  res.status(200).render("post", {
    layout: "hero",
    title: "Blog",
    checkloginType: req.cookies.jwt ? true : false
  });
});

app.use("/posts", postRouter);
app.use("/authors", authorRouter);
app.use("/admin", adminRouter);
app.use("/verify", adminRouter);
app.use("/gmaillogin", gmailRouter);
app.use("/auth", gmailRouter);
app.listen(8080, () => {
  console.log("Server started");
});
