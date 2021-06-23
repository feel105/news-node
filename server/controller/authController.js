"use strict";

const jwt = require("jsonwebtoken");
const authorService = require("../models/authors");
const config = require("../../server/config/index");

const authController = {
  signUp: async (req, res, next) => {
    try {
      console.log(req.body);
      //validation before insert in db
      const author = new authorService(req.body);
      const authors = await author.save();
      return res.status(201).json(authors);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const author = await authorService.findOne({ email });
      if (author && author.authenticate(password)) {
        const profile = {
          name: author.name,
          email: author.email,
          id: author.id,
        };
        const token = jwt.sign(profile, config.secret, {
          expiresIn: "7d",
        });
        author.authToken = token;
        //update Token in table
        authorService.updateOne(
          { _id: author.id },
          { authToken: token },
          function (err, data) {
            return res.status(200).json(author);
          }
        );
        const io = req.app.get("socketio");
        io.emit("authData", author);
      } else {
        return res
          .status(406)
          .json({ success: false, message: "Author not Valid" });
      }
    } catch (error) {
      console.log("err", error);
      return res
        .status(500)
        .json({ success: false, message: "Invalid Email & password" });
    }
  },
};

module.exports = authController;
