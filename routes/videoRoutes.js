const express = require("express");
const Router = express.Router();
const Chat = require('../Model/Chat');
const {ensureAuthenticated} = require('../config/auth');
const {initials, firstName} = require('../libs/string');
const io = require('../socket');
const fs = require("fs");
const path = require("path");

Router.get('/video', ensureAuthenticated, async(req,res,next) => {
  let connected_users = await Chat.find({room_id: "watchparty"});
  let users = connected_users.map(user =>initials(user.name));
  let username = firstName(req.user.name);
  if(users.findIndex(user => user == initials(req.user.name)) == -1) {
      users.push(initials(req.user.name));
  }
  // try {
  //   let socket_id = await Chat.findOne().select('socket_id');
  //   console.log("Hello I am Chandler");
  //   if(socket_id != null) {
  //     io.getIO().to('watchparty').emit('')
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  res.render('video', {username, users, extractStyles: true});
})

Router.get("/video_link", function (req, res) {
  const path = "assets/conjuring.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    io.getIO().emit("range", {
      action: "create",
      range: range,
    });
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = Router;