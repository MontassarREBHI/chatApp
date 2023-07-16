/* eslint-disable react/prop-types */
import {useEffect,useState,useRef} from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [notification,setNotification]=useState([])
  const lastMessageRef = useRef(null);
  useEffect(() => {
    socket.on('messageResponse', (data) => {
      console.log(data)
      setMessages([...messages, data])
      setNotification(prevNotifications => {
        const sender = prevNotifications.find(e => e.name === data.name);
        if (sender) {
          const updatedNotifications = prevNotifications.map(item => {
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
      })
  }, [messages,socket]);
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);
  
  return (
    <div className="chat">
      <ChatBar  socket={socket} notification={notification}/>
      <div className="chat__main">
        <ChatBody messages={messages} socket={socket} lastMessageRef={lastMessageRef}  typingStatus={typingStatus}/>
        <ChatFooter socket={socket} setTypingStatus={setTypingStatus}/>
      </div>
    </div>
  );
};

export default ChatPage;