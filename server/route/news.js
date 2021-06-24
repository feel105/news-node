const express = require("express");
const NewsRouting = express.Router();
const newsController = require("../controller/newsController");
const commentController = require("../controller/commentController");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const authorService = require("../models/authors");

module.exports = (io) => {
  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const secret = config.secret;
      jwt.verify(socket.handshake.query.token, secret, async (err, decoded) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        socket.decoded = decoded;
        socket.emit("message", decoded);
        next();
      });
    } else {
      console.log("Authentication");
      next(new Error("Authentication error"));
      return;
    }
  }).on("connection", (socket) => {
    socket.on("allNews", async () => {
      sendAllNews();
    });
    socket.on("getNewsById", async (id) => {
      const newsObject = await newsController.getNewsById(id);
      socket.emit("getNewsById", newsObject);
    });

    socket.on("getNewsComments", async () => {
      console.log("getNewsWithComments_ca");
      const newsObject = await newsController.getNewsWithComments();
      io.emit("getNewsComments", newsObject);
      socket.emit("getNewsComments", newsObject);
    });

    //add news
    socket.on("addNews", async (req) => {
      const newsObject = await newsController.addNews(req, socket);
      socket.emit("addNews", newsObject);
      if (newsObject.success) {
        sendAllNews();
      }
    });

    //Edit news get event send only that author
    socket.on("editNews", async (req) => {
      const newsObject = await newsController.editNews(req, socket);
      socket.emit("editNews", newsObject);
      if (newsObject.success) {
        sendAllNews();
      }
    });

    //delete news using id
    socket.on("deleteNews", async (id) => {
      const newsObject = await newsController.deleteNews(id, socket);
      socket.emit("deleteNews", newsObject);
      if (newsObject.success) {
        sendAllNews();
      }
    });

    //send all news to all Author
    const sendAllNews = async () => {
      const newsObject = await newsController.getNewsWithComments(); //getAllNews
      io.emit("allNews", newsObject); //io emit send to all user
    };
    //console.log(`Socket ${socket.id} has connected`);

    //add comment using
    socket.on("addComments", async (req) => {
      const newsObject = await commentController.addComments(req, socket);
      socket.emit("addComments", newsObject);
      if (newsObject.success) {
        sendAllNews();
      }
    });
  });
  return NewsRouting;
};
