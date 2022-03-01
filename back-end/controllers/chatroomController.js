const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Message = mongoose.model("Message");

exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom with that name already existss!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
    id:chatroom._id
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});
  res.json(chatrooms);
};
/* exports.getAllChats = async (req, res) => {

  //console.log("kerunund", JSON.stringify(req))
  const {chatroomId}=req.body;
  const chatroom=chatroomId
  console.log("iddd",JSON.stringify(req.body))
  const messages = await Message.find({chatroom:'621c149e00e2bcb6255e0faf'}).sort({$natural:1}).limit(3);
console.log("output",messages)
  res.json(messages);
  
}; */