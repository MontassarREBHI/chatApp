/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ChatBar = ({ socket ,notification}) => {
  const [users, setUsers] = useState([]);
  
  
  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
    
  }, [socket, users]);
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users.map((user) => (
            <p style={{cursor:'pointer'}}
              key={user.socketID}
              onClick={() => localStorage.setItem("receiver",user.socketID)}
            >
              {user.userName}:::{notification.find(e=>e.name === user.userName)?.count } 
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
