import { useState,useEffect } from 'react'
import io from 'socket.io-client'

import './App.css'
const socket = io.connect('http://localhost:3000')
function App() {
  
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    socket.on("receive",(data)=>{
      alert(data.message)
    })
  
  }, [socket]);
  const sendMessage=()=>{
    socket.emit("send_message",{message:'hello'})
  }
  
  return (
    <>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more {count}
      </p>
      <button onClick={sendMessage}> send message </button>
    </>
  )
}

export default App
