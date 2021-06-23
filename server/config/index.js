"use strict";
module.exports = {
  port: process.env.PORT || 3000,
  database: process.env.MONGODB_URL || "mongodb://localhost:27017/news",
  secret: "feel-patel",
};
