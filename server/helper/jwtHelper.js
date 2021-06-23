/**Dependencies */
const expressJwt = require("express-jwt"); //for middeleware check
const config = require("../config/index");
const authorService = require("../models/authors");

function jwtHelper() {
  const secret = config.secret;
  return expressJwt({ secret, algorithms: ["HS256"], isChekedAuthor }).unless({
    path: [
      //routes that don't require authentication
      "/auth/login",
      "/auth/signUp",
    ],
  });
}

async function isChekedAuthor(req, data, done) {
  console.log(req, " ischeckedAUth");
  console.log(data, " oa ");
  const user = await authorService.getById(data.id);
  if (!user) {
    return done(null, true);
  }
  done();
}

module.exports = jwtHelper;
