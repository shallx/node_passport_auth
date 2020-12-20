const express = require("express");
const chalk = require("chalk");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const { log } = require("console");
const flash = require("connect-flash");
const session = require("express-session");
const cookieSession = require("cookie-session");
const passport = require('passport');
const Chat = require("./Model/Chat");
const {initials, firstName} = require('./libs/string');
require('./config/passport')(passport);

// Environment Variables
require("dotenv").config();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const db_link = process.env.MONGO_URI;
const secret_session_key = process.env.SESSION_KEY || "secret";

// Mongodb connect
mongoose
  .connect(db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(async() => {
    await Chat.deleteMany({});
    log("MongoDb Connected!!!");
  })
  .catch(err => log(err));

// Static paths
app.use(express.static(path.join(__dirname, "public")));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session


// app.use(
//   session({
//     secret: secret_session_key,
//     resave: true,
//     saveUninitialized: true,
//     // cookie: { secure: true },
//   })
// );
app.use(cookieSession({
  maxAge: 3* 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY],
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global vars
var connected_user;
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); //passport error
  connected_user = req.user;
  next();
});

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout extractScripts", true);

// Routes
require("./routes").routes(app);


const server = app.listen(port, host, () => {
  console.log(
    chalk.black.bgCyanBright(
      " Server is listening ",
      chalk.underline(`http://${host}:${port} `)
    )
  );
});
const io = require("./socket.js").init(server);
io.on("connection", async(socket) => {
  socket.on("disconnect", async() => {

    if(connected_user){
      try {
        let client_name = (connected_user) ? connected_user.name : 'Client';
        let data = {};
        data.initials = initials(connected_user.name);
        data.firstName = firstName(connected_user.name);
        socket.to('watchparty').emit('user_disconnected', data);
        console.log(`${client_name} disconnected`);
        await Chat.deleteOne({sender_id: connected_user._id});
      } catch (error) {
        console.log(error);
      }
    }
  });
  socket.on("message", data => {
    socket.to('watchparty').emit("message", data);
    // console.log(data.message);
  });

  socket.on("join", async() => {
    console.log("User connected: " + socket.id);
    socket.join('watchparty');
    try{
      if(connected_user){
        let first_boy = await Chat.findOne({sender_id : { $ne: connected_user._id}});
        if(first_boy){
          io.to(first_boy.socket_id).emit('where_is_everyone', socket.id);
        }
  
        var checkIfAllreadyExist = await Chat.findOne({sender_id: connected_user._id});
        //Connecting User and putting on the data;
        if(checkIfAllreadyExist == null) {
          console.log("Connected User name: " + connected_user.name);
          let data = {};
          data.initials = initials(connected_user.name);
          data.firstName = firstName(connected_user.name);
          socket.to('watchparty').emit('newconnection', data);
          var result = await Chat.create({
            name: connected_user.name,
            sender_id: connected_user,
            socket_id: socket.id,
            room_id: 'watchparty',
          });
          // console.log(result);
        } else {
          if(checkIfAllreadyExist.socket_id != socket.id){
            checkIfAllreadyExist.socket_id = socket.id;
            await checkIfAllreadyExist.save();
          }
        }
      }
    } catch(error){
      console.log(error);
    }

  });

  socket.on('there_they_are', (data) => {
    io.to(data.socket_id).emit('let_me_catch_up', data.currentTime);
  })

  socket.on("leave", async () => {
    let chat = await Chat.deleteOne({sender_id: connected_user.id});
    console.log(connected_user.name + " Left the room");
  })
  // VIdeo player socket

  socket.on("paused", msg => {
    socket.to('watchparty').broadcast.emit("paused", { paused_at: msg.paused_at });
  });
  socket.on("play", msg => {
    socket.to('watchparty').broadcast.emit("play", { play_at: msg.play_at });
  });
  socket.on("seeked", msg => {
    socket.to('watchparty').broadcast.emit("seeked", { seeked_at: msg.seeked_at });
  });
});
