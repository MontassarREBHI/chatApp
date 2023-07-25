/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const ChatBody = ({ messages, lastMessageRef, typingStatus, receiver }) => {
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState([]);
  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("receiverName");
    localStorage.removeItem("receiver");
    navigate("/");
    window.location.reload();
  };
  console.log(discussion);
  useEffect(() => {
    setDiscussion(
      messages.filter(
        (msg) =>
          (msg.name === localStorage.getItem("userName") &&
            msg.receiverName === localStorage.getItem("receiverName")) ||
          (msg.receiverName === localStorage.getItem("userName") &&
            msg.name === localStorage.getItem("receiverName"))
      )
    );
  }, [receiver, messages]);

  return (
    <>
      <header className="chat__mainHeader">
        <p>Hangout with Colleagues </p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      {/*This shows messages sent from you*/}
      <div className="message__container">
        {discussion.map((message) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p ref={lastMessageRef}>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p ref={lastMessageRef}>{message.text}</p>
              </div>
            </div>
          )
        )}
        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div />
      </div>
    </>
  );
};

export default ChatBody;
