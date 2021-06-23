const express = require("express");
const NewsRouting = express.Router();
const newsController = require("../controller/newsController");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const authorService = require("../models/authors");

// authRouting
//   .get("/", newsController.getAllNews)
//   .post("/", newsController.addNews)
//   .put("/:newsId", newsController.editNews)
//   .delete("/:newsId", newsController.deleteNews);
// module.exports = authRouting;
//const Router = require("express").Router;
//const router = new Router();

module.exports = (io) => {
  const documents = {};
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
    // let previousId;
    // const safeJoin = (currentId) => {
    //   socket.leave(previousId);
    //   socket.join(currentId, () =>
    //     console.log(`Socket ${socket.id} joined room ${currentId}`)
    //   );
    //   previousId = currentId;
    // };
    socket.on("allNews", async (req) => {
      console.log("allNews");
      const newsObject = await newsController.getAllNews(req);
      io.emit("allNews", newsObject);
    });
    socket.on("getNewsById", async (req) => {
      const newsObject = await newsController.getNewsById(req);
      socket.emit("getNewsById", newsObject);
      //safeJoin(docId);
      //socket.emit("document", documents[docId]);
    });
    socket.on("addNews", async (req) => {
      //add doc using id title subtitle desc
      //documents[doc.id] = doc;
      //safeJoin(doc.id);
      console.log("addNews");
      const newsObject = await newsController.addNews(req, socket);
      console.log(newsObject, " NewOVjec ");
      socket.emit("addNews", newsObject);
      if (newsObject.success) {
        io.emit("allNews", newsObject);
      }
    });
    socket.on("editNews", async (req) => {
      const newsObject = await newsController.editNews(req, socket);
      console.log(newsObject, " EditNews ");
      socket.emit("editNews", newsObject);
      if (newsObject.success) {
        io.emit("allNews", newsObject);
      }
      //documents[doc.id] = doc;
      //socket.to(doc.id).emit("document", doc);
    });
    socket.on("deleteNews", async (req) => {
      const newsObject = await newsController.deleteNews(req);
      console.log("esEDelet", newsObject);
      socket.emit("deleteNews", newsObject);
      if (newsObject.success) {
        socket.emit("allNews", newsObject);
      }
    });
    //io.emit("documents", Object.keys(documents));
    //socket.emit("id", socket.id);
    console.log(`Socket ${socket.id} has connected`);
  });
  return NewsRouting;
};
