const express= require('express')
const app=express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors =require('cors')
app.use(cors())
const io = new Server(server,{cors:{
    origin:"http://localhost:5173",
    methods:['GET','POST']
}});

app.use(express.json())
let users=[]
// app.get('/', (req, res) => {
//     res.send('<h1>Hello world</h1>');
//   });
io.on('connection', (socket) => {
    console.log('⚡ a user connected',socket.id);
    socket.on("message",(data)=>{
      io.emit('messageResponse', data)
    })
    socket.on("newUser",(data)=>{
      users.push(data)
      io.emit('newUserResponse', users)})
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
       //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
    socket.disconnect();
    });
  }
  
 )
 
server.listen(3000,()=>{
    console.log('server is listenning on port 3000')
})