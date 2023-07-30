/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ChatBar = ({ socket, setReceiver }) => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    socket.on("newUserResponse", (data) => {
      const newData = data.map((e) => {
        e.selected = false;
        
        return e;
      });
      setUsers(newData);
    });
    socket.on("notification",(data)=>{
      if(data.name!==localStorage.getItem("receiver")){
       const targetUser = users.find(user=>user.username===data.name)
       targetUser.notification ? targetUser.notification+=1 : targetUser.notification = 1
       setUsers(prev=> prev.map(e =>{
         return e.username===targetUser.username ? targetUser:e
      
       }))
      }
      
      })
  }, [socket]);
  console.log(users);
  
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users
            ?.filter(
              (user) => user.username !== localStorage.getItem("userName")
            )
            .map((user) => (
              <p
                style={user.selected ? { cursor: "pointer",
                backgroundColor: "#90EE90", } : { cursor: "pointer" }}
                key={user.socketId}
                onClick={() => {
                  localStorage.setItem("receiver", user.socketId);
                  localStorage.setItem("receiverName", user.username);
                  setReceiver(localStorage.getItem("receiver"));
                  setUsers((prev) => {
                    return prev.map((e) => {
                      if (e._id === user._id) {
                        return { ...e, selected: true };
                      } else {
                        return { ...e, selected: false };
                      }
                    });
                  });
                }}
              >
                {user.username} : {user?.notification}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
