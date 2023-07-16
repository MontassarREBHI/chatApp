const User = require("../models/user");

const createUser = async (req, res) => {
  const { username, socketId } = req.body;
  const user = await User.findOneAndUpdate({ username },{socketId},{new:true});
  if (user) return res.status(200).send("user already exisit");
  else {
    const newUser = new User({ username, socketId,connected:true });

    newUser
      .save()
      .then(() =>
        res.status(200).json({ newUser, message: "user created successfully!" })
      )
      .catch((err) => {
        res.status(400).send("something wrong");
      });
  }
};
const allUsers= User.find({})
module.exports={createUser,allUsers}