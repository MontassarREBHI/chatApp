/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [messageHistory,setMesageHistory]=useState([])
  const [typingStatus, setTypingStatus] = useState("");
  const [notification, setNotification] = useState([]);
  const lastMessageRef = useRef(null);
  const [receiver, setReceiver] = useState(localStorage.getItem("receiver"));
 
  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data]);
      setNotification((prevNotifications) => {
        const sender = prevNotifications.find((e) => e.name === data.name);
        if (sender) {
          const updatedNotifications = prevNotifications.map((item) => {
            if (item.name === data.name) {
              return { ...item, count: item.count + 1 };
            }
            return item;
          });
          return updatedNotifications;
        } else {
          return [...prevNotifications, { name: data.name, count: 1 }];
        }
      });
    });
  }, [socket,messages]);
  
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    //   axios.post("http://localhost:3000/message", messages[messages.length - 1]);
  }, [messages]);
  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
   axios.get().then((res)=>setMesageHistory(res.data))
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar
        socket={socket}
        notification={notification}
        setReceiver={setReceiver}
        
      />
      <div className="chat__main">
        <ChatBody
          receiver={receiver}
          messages={messages}
          socket={socket}
          lastMessageRef={lastMessageRef}
          typingStatus={typingStatus}
        />
        <ChatFooter socket={socket} setTypingStatus={setTypingStatus} />
      </div>
    </div>
  );
};

export default ChatPage;
