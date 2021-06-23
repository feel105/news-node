"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

/**AuthorSchema**/
const AuthorSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    encrypt_password: { type: String, default: "" },
    authToken: { type: String, expires: "1m", default: "" },
  },
  {
    timestamps: true,
    collection: "authors",
  }
);

/**set encrypt password**/
AuthorSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.encrypt_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**Validation**/
AuthorSchema.path("name").validate(function (name) {
  return name.length;
}, "Name is required");
AuthorSchema.path("email").validate(function (email) {
  return email.length;
}, "Email is required");
AuthorSchema.path("email").validate(function (email) {
  return new Promise((resolve) => {
    const Author = mongoose.model("Author");
    if (this.isNew || this.isModified("email")) {
      Author.find({ email }).exec((err, authors) =>
        resolve(!err && !authors.length)
      );
    } else resolve(true);
  });
}, "Email `{VALUE}` already exists");
AuthorSchema.path("encrypt_password").validate(function (password) {
  return password.length && this._password.length;
}, "Password is required");

/** pre save **/
AuthorSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  next();
});

/** methods **/
AuthorSchema.methods = {
  //check auth password
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.encrypt_password);
  },
  //check encrypt password
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return bcrypt.hashSync(password, 10);
    } catch (err) {
      return "";
    }
  },
  hasExpired: function () {
    var now = Date.now();
    return now - Date.parse(createDate) > 604800000; // Date is converted to milliseconds to calculate 7 days it > one day = 24 hours * 60 minutes * 60 seconds *1000 milliseconds * 7 days = 604800000
  },
};

/**here call own method**/
AuthorSchema.statics = {};
module.exports = mongoose.model("Author", AuthorSchema);
