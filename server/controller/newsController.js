"use strict";
const newsService = require("../models/news");
const validator = require("../helper/validate");
const mongoose = require("mongoose");

const newsController = {
  getAllNews: async () => {
    try {
      const newsObject = await newsService.find();
      if (newsObject) {
        return { success: true, payload: newsObject };
      }
      return { success: false, message: "Not Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getNewsById: async (id) => {
    try {
      const newsObject = await newsService.findById(id);
      if (newsObject) {
        return { success: true, payload: newsObject };
      }
      return { success: false, message: "Not Data Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  addNews: async (req, socket) => {
    try {
      console.log(socket.decoded.id);
      if (socket.decoded.id) {
        var reqBody = {
          author: socket.decoded,
          title: req.title,
          subTitle: req.subTitle,
          description: req.description,
        };
        const newObj = new newsService(reqBody);
        const newObject = await newObj.save();
        return { success: true, payload: newObject };
      }
      return { success: false, message: "Author Not Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  editNews: async (req, socket) => {
    try {
      var reqBody = {
        title: req.title,
        subTitle: req.subTitle,
        description: req.description,
      };
      var conditions = { _id: req._id, "author.id": socket.decoded.id }; //and where author : socket.id
      const newsEditObject = await newsService.findOneAndUpdate(
        conditions,
        reqBody,
        {}
      );
      if (newsEditObject) {
        return { success: true, payload: newsEditObject };
      }
      return { success: false, message: "Not Data Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  deleteNews: async (id, socket) => {
    try {
      const newsDeleteObject = await newsService.deleteOne({
        _id: id,
        "author.id": socket.decoded.id,
      });
      if (newsDeleteObject.deletedCount) {
        return { success: true, payload: newsDeleteObject };
      }
      return { success: false, message: "Not Data Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getNewsWithComments: async () => {
    try {
      var resources = {};
      const newsObject = await newsService.aggregate([
        {
          $lookup: {
            from: "comments", // from collection name
            localField: "_id",
            foreignField: "news_id",
            as: "comments",
          },
          /* $lookup: {
            from: "authors", // from collection name object save of author 
            localField: "author",
            foreignField: "_id",
            as: "author",
          },*/
        },
      ]);
      return { success: true, payload: newsObject };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

module.exports = newsController;
