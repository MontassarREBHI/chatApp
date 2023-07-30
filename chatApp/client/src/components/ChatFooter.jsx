import { useState, useEffect } from "react";
import checkPageStatus from "../utils/functions";

const ChatFooter = ({ socket, setTypingStatus }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkPageStatus(message, localStorage.getItem("userName"));
  }, [message]);
  const handleTyping = () =>
    socket.emit("typing", `${localStorage.getItem("userName")} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userName")) {
      const data = {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketId: socket.id,
        socketReceiver: localStorage.getItem("receiver"),
        receiverName: localStorage.getItem("receiverName"),
        added: false,
      };

      socket.emit("message", data);
      checkPageStatus(message, localStorage.getItem("userName"));
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={() => setTypingStatus("")}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;