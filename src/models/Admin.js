const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  isVerified: { type: Boolean, default: false }
});

const Admin = model("Admin", AdminSchema);

module.exports = Admin;
