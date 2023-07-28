/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatPage = ({ socket }) => {
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const [receiver, setReceiver] = useState(localStorage.getItem("receiver"));

  // useEffect(() => {
  //   // 👇️ scroll to bottom every time messages change
  //   lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  //   //   axios.post("http://localhost:3000/message", messages[messages.length - 1]);
  // }, [messages]);
  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} setReceiver={setReceiver} />
      <div className="chat__main">
        <ChatBody
          receiver={receiver}
          socket={socket}
          typingStatus={typingStatus}
        />
        <ChatFooter socket={socket} setTypingStatus={setTypingStatus} />
      </div>
    </div>
  );
};

export default ChatPage;
