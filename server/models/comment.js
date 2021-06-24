"use strict";
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

/**CommentSchema**/
const CommentSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    comment: { type: String, default: "" },
    news_id: { type: String, ref: "News" },
    author: { type: Object },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

/**Validation**/
CommentSchema.path("comment").validate(function (comment) {
  return comment.length;
}, "Comment is required");
CommentSchema.path("news_id").validate(function (news_id) {
  return news_id.length;
}, "News id is required");

/** pre save **/
CommentSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  next();
});

/** methods **/
CommentSchema.methods = {};

/**here call own method**/
CommentSchema.statics = {};
module.exports = mongoose.model("Comment", CommentSchema);
