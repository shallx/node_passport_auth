const mongoose = require("mongoose");
const { Schema } = require("mongoose");
// const validator = require("validator");

const chatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  socket_id: {
    type: String,
  },
  room_id: String,
});

module.exports = mongoose.model("Chat", chatSchema);