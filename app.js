var createError = require("http-errors");
var express = require("express");
const app = express();
//var http = require('http').Server(app);
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session          = require("express-session");
const expressValidator = require("express-validator");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser")

var passport = require("passport");

var usersRouter = require("./routes/users");
var testsRouter = require("./routes/tests");
var errorRouter = require("./routes/error");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/authentication/login");
var registerRouter = require("./routes/authentication/register");
var logoutRouter = require("./routes/authentication/logout");
var lobbyRouter = require("./routes/lobby");
var gameRouter = require("./routes/game");


require("./config/passport")(passport)

if( process.env.NODE_ENV === "development" ){
  require( "dotenv" ).config();
}

// view engine setup
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split(".")
          , root    = namespace.shift()
          , formParam = root;

      while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
      }
      return {
          param : formParam,
          msg   : msg,
          value : value
      };
    }
  })
);

app.use(
  session({
    secret: "csc667",
    resave: false,
    saveUninitialized: false
  })
);

app.use(favicon("./public/images/favicon.ico"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tests", testsRouter);
app.use("/error", errorRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);
app.use("/lobby", lobbyRouter);
app.use("/game", gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.io = io;

let chatNameSpace = io.of("/chat-namespace");
//let gameChat = io.of("/gameChatSocket");

chatNameSpace.on("connection", function(client) {
  console.log("Lobby chat connected (io)...");

  client.on("join", function(data) {
    console.log(data);
  });

  client.on("messages", function(data){
    client.emit("thread", data);
    client.broadcast.emit("thread", data);
  });
});

io.sockets.on("connection", function(socket) {
  console.log("Game chat connected (io)...");

  socket.on('room', function(room) {
        socket.join(room);
        socket.room = room;
        console.log('Hello server from game chatroom: ' + room);
    });

/*
  socket.on("join", function(data) {
    console.log(data);
  });*/

  socket.on("messages", function(data){
    io.sockets.in(socket.room).emit("thread", data);
    //socket.broadcast.emit("thread", data);
  });
});


module.exports = {
  app: app,
  server: server
};