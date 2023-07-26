const Message = require("../models/message");
const { where } = require("../models/user");

const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  newMessage
    .save()
    .then(() =>
      res
        .status(200)
        .json({ newMessage, message: "message created successfully!" })
    )
    .catch((err) => {
      res.status(400).send("bad request , please verify your input");
    });
};
const getMyMessages = async (req, res) => {
  const { userName, receiverName } = req.params;
  const myMessage = await Message.find({
    $or: [
      { name: userName, receiverName: receiverName },
      { name: receiverName, receiverName: userName },
    ],
  }).exec();

  myMessage.length
    ? res.status(200).json({ myMessage, message: "here is the discussion" })
    : res.status(400).send("no messages found!");
};

module.exports = { createMessage, getMyMessages };
