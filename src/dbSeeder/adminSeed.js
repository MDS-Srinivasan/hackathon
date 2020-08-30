require("../dbconfig/db");
const Admin = require("../models/Admin");
const { hash } = require("../utils/hash");
const faker = require("faker");
const AdminPost = async () => {
  try {
    const NewAdmin = new Admin({
      email: "mdeepan@gmail.com",
      firstname: "t",
      lastname: "test",
      passwordHash: hash("1243")
    });
    const result = await NewAdmin.save();
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};
AdminPost();
