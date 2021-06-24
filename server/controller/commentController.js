"use strict";
const commentService = require("../models/comment");

const commentController = {
  addComments: async (req, socket) => {
    try {
      console.log(socket.decoded.id);
      if (socket.decoded.id) {
        var reqBody = {
          author: socket.decoded,
          comment: req.comment,
          news_id: req.id,
        };
        const commentObj = new commentService(reqBody);
        const dataObject = await commentObj.save();
        return { success: true, payload: dataObject };
      }
      return { success: false, message: "Author Not Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

module.exports = commentController;
