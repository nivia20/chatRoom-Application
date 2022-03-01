const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Message = mongoose.model("Message");
exports.createChatroom = async (req, res) => {  // create chatroom API
  const { name } = req.body;
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets."; //chatroom name validation
  const chatroomExists = await Chatroom.findOne({ name });    //check whether a name already exist or not
  if (chatroomExists) throw "Chatroom with that name already existss!";
  const chatroom = new Chatroom({
    name,
  });
  await chatroom.save();  //saving on DB
  res.json({
    message: "Chatroom created!",
    id: chatroom._id,
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});
  res.json(chatrooms);
};

