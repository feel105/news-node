"use strict";
const newsService = require("../models/news");
const validator = require("../helper/validate");
const mongoose = require("mongoose");

const newsController = {
  getAllNews: async () => {
    try {
      const newsObject = await newsService.find();
      console.log(newsObject, " News_Obje ");
      if (newsObject) {
        return { success: true, payload: newsObject };
      }
      return { success: false, message: "Not Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getNewsById: async (req) => {
    try {
      const newsObject = await newsService.findById(req.id);
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
      /*const validationRule = {
        title: "required|string",
        subTitle: "required|string",
        description: "required|string",
      };
       var response = await validator(req, validationRule, {});
       console.log(response, "res");
      /*validator(req, validationRule, {}, async (err, status) => {
        console.log(err, status);
        if (!status) {
          return { success: false, message: err.Errors.errors };
        } else {         
        }
      });*/
      var reqBody = {
        author: socket.id,
        title: req.title,
        subTitle: req.subTitle,
        description: req.description,
      };
      const newObj = new newsService(reqBody);
      const newObject = await newObj.save();
      return { success: true, payload: newObject };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  editNews: async (req) => {
    try {
      var reqBody = {
        title: req.title,
        subTitle: req.subTitle,
        description: req.description,
      };
      var conditions = { _id: req.id }; //and where author : socket.id
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
  deleteNews: async (req) => {
    try {
      //var id = `${req._id}`;
      //var ID = mongoose.Types.ObjectId(id);
      const newsDeleteObject = await newsService.deleteOne({ _id: req.id });
      if (newsDeleteObject.deletedCount) {
        return { success: true, payload: newsDeleteObject };
      }
      return { success: true, payload: "Not Data Found" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

module.exports = newsController;
