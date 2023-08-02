/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const ChatBar = ({ socket, setReceiver, receiver }) => {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   setUsers((prev) => {
  //     return prev.map((e) => {
  //       if (e.username === localStorage.getItem("receiverName")) {
  //         return { ...e, selected: true, notification: 0 };
  //       } else {
  //         return { ...e, selected: false };
  //       }
  //     });
  //   });
  // }, [receiver]);
  useEffect(() => {
    // Event listener for the first event
    socket.on("newUserResponse", (data) => {
      const newData = data.map((e) => {
        e.selected = false;
        return e;
      });
      setUsers(newData);
    },[socket]);

    // Event listener for the second event, will execute only if the users array is not empty
    if (users.length > 0) {
      socket.on("notification", (data) => {
        console.log(users, "inside notification useEffect");
        console.log(data);
        if (data.name !== localStorage.getItem("receiverName")) {
          const targetUser = users.find((user) => user.username === data.name);
          console.log(targetUser);
          targetUser?.notification
            ? (targetUser.notification += 1)
            : (targetUser.notification = 1);

          setUsers((prev) =>
            prev.map((user) =>
              user.username === targetUser.username ? targetUser : user
            )
          );
        }
      });
    }
  }, [socket,receiver]);

 const handleClickUser=(user)=>{
  localStorage.setItem("receiver", user.socketId);
  localStorage.setItem("receiverName", user.username);
  setReceiver(localStorage.getItem("receiver"));
  setUsers((prev) => {
    return prev.map((e) => {
      if (e._id === user._id) {
        const selectedUser=e
              selectedUser.selected=true
              selectedUser.notification=0
        return selectedUser
      } else {
        return { ...e, selected: false };
      }
    });
  });
}

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
                style={
                  user.selected
                    ? { cursor: "pointer", backgroundColor: "#90EE90" }
                    : { cursor: "pointer" }
                }
                key={user.socketId}
                onClick={()=>handleClickUser(user)}
              >
                {user.username}{" "}
                {!user.hasOwnProperty("notification") ||
                user.notification === 0 ? (
                  ""
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBell} size="lg" />
                    {user.notification}
                  </>
                )}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
