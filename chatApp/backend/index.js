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


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });
io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on("send_message",(data)=>{socket.broadcast.emit("receive",data)})
  }
  
 )
 
server.listen(3000,()=>{
    console.log('server is listenning on port 3000')
})