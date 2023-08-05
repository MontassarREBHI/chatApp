/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const ChatBar = ({ socket, setReceiver, receiver }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    users.length
      ? setUsers((prev) => {
          return prev.map((e) => {
            e.notification = 0;
            e.selected = false;
            return e;
          });
        })
      : null;
  }, []);

  useEffect(() => {
    setUsers((prev) => {
      return prev.map((e) => {
        if (e.selected) {
          return { ...e, notification: 0 };
        } else {
          return e;
        }
      });
    });
    // Event listener for the first event
    socket.on("newUserResponse", (data) => {
      const newUser = data.filter((e) => {
        !users.find((user) => user.username === e.username);
      });
      newUser.notification = 0;
      newUser.selected = false;
      setUsers((prev) => [...prev, newUser]);
    });

    // Event listener for the second event, will execute only if the users array is not empty
    if (users.length > 0) {
      socket.on("notification", (data) => {
        console.log(users, "inside notification useEffect");
        console.log(data);
        if (data.name !== users.find((e) => e.selected)) {
          const targetUser = users.find((user) => user.username === data.name);
          console.log(targetUser);
          targetUser.notification += 1;

          setUsers((prev) =>
            prev.map((user) =>
              user.username === targetUser.username ? targetUser : user
            )
          );
        }
      });
    }
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
            .map((user, i) => (
              <p
                style={
                  user.selected
                    ? { cursor: "pointer", backgroundColor: "#90EE90" }
                    : { cursor: "pointer" }
                }
                key={i}
                onClick={() => {
                  localStorage.setItem("receiver", user.socketId);
                  localStorage.setItem("receiverName", user.username);
                  setReceiver(localStorage.getItem("receiver"));
                  setUsers((prev) => {
                    return prev.map((e) => {
                      if (e.username === user.username) {
                        e.selected = true;
                        e.notification = 0;
                        return e;
                      } else return e;
                    });
                  });
                }}
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
