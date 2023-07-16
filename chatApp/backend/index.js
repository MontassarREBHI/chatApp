const express = require("express");
const connectDB = require("./db");
const userController = require("./controllers/user");
const User = require("./models/user");
const app = express();
connectDB();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

let users;

app.put("/login", async (req, res) => {
  const { username, socketId } = req.body;

  const user = await User.findOneAndUpdate(
    { username },
    { socketId },
    { new: true }
  );
  if (user) {
    users = await User.find({});

    io.emit("newUserResponse", users);

    res.status(200).send("user already exisit");
  } else {
    const newUser = new User({ username, socketId, connected: true });

    newUser
      .save()
      .then(async () => {
        users = await User.find({});

        io.emit("newUserResponse", users);
        res
          .status(200)
          .json({ newUser, message: "user created successfully!" });
      })
      .catch((err) => {
        res.status(400).send("something wrong");
      });
  }
});
io.on("connection", async (socket) => {
  console.log("⚡ a user connected", socket.id);

  //message event
  socket.on("message", (data) => {
    console.log(data.socketReceiver);
    data.socketReceiver
      ? io.to(data.socketReceiver).emit("messageResponse", data)
      : io.emit("messageResponse", data);
  });

  // newUser event
  // socket.on("newUser", async(data) => {
  //   users= await User.find({})
  //   io.emit("newUserResponse", users);
  // });

  // onTyping event
  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  // disconnect event
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users?.filter((user) => user.connected === true);
    // console.log(users);
    //Sends the list of users to the client
    // io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

server.listen(3000, () => {
  console.log("server is listenning on port 3000");
});
