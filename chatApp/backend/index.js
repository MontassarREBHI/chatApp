const express = require("express");
const connectDB= require('./db')
const userController =require('./controllers/user')
const User= require('./models/user')
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
// let users = [];

app.post('/login',userController.createUser)
io.on("connection", async(socket) => {
  console.log("⚡ a user connected", socket.id);
  let users= await User.find({})
  
  //message event
  socket.on("message", (data) => {
    data.socketReceiver
      ? io.to(data.socketReceiver).emit("messageResponse", data)
      : io.emit("messageResponse", data);
  });

  // newUser event
  socket.on("newUser", (data) => {
    
    io.emit("newUserResponse", users);
  });


  // onTyping event
  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));
  
  // disconnect event
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.connected === true);
    // console.log(users);
    //Sends the list of users to the client
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

server.listen(3000, () => {
  console.log("server is listenning on port 3000");
});
