const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AuthRouter = require("./route/auth");
const config = require("./config/index");
const jwtHelper = require("./helper/jwtHelper");
const responseHelper = require("./helper/responseHelper");
const app = express();
const server = require("http").createServer(app);
app.io = require("socket.io")(server, { cors: { origin: "*" } }); //for cors Domain
/* {
  cors: {
    origins: ["http://localhost:3000"],
  },
} */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jwtHelper());
app.set("socketio", app.io);
const NewsRouter = require("./route/news")(app.io);

const port = process.env.PORT || 3000;
app.use("/auth", AuthRouter);
app.use("/news", NewsRouter);

app.use(responseHelper); //Handle Error Response
/**listing port */
const listing = () => {
  server.listen(port, () => {
    console.log(`server listing on ${port}`);
  });
};
/**Reconnect mongodb */
const reconnectDb = () => {
  mongoose.connect(config.database, {
    keepAlive: 1,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.on("disconnected", reconnectDb);
  db.once("open", listing);
};
reconnectDb();
