"use strict";
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

/**NewsSchema**/
const NewsSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    title: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    //author: { type: String, ref: "Author" },
    //comments: { type: String, ref: "Comments" }
    author: { type: Object },
    //comments: { type: Array },
  },
  {
    timestamps: true,
    collection: "news",
  }
);

/**Validation**/
NewsSchema.path("title").validate(function (title) {
  return title.length;
}, "Title is required");
NewsSchema.path("subTitle").validate(function (subTitle) {
  return subTitle.length;
}, "SubTitle is required");
NewsSchema.path("description").validate(function (desc) {
  return desc.length;
}, "Description is required");

/** pre save **/
NewsSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  next();
});

/** methods **/
NewsSchema.methods = {};

/**here call own method**/
NewsSchema.statics = {};
module.exports = mongoose.model("News", NewsSchema);
