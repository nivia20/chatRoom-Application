import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const ChatroomPage = ({ props, match, socket }) => {
  const messageMaxNumber = 8;
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [chatrooms, setChatrooms] = React.useState([]);
  const [isURL, setisURL] = React.useState(false);

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      const val = isvalidURL(messageRef.current.value);
      if (val != null) {
        setisURL(true);
      }
      messageRef.current.value = "";
    }
  };
  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };
  const isvalidURL = (string) => {  //to check whether a string is URL or not
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res;
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, [props]);
  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        console.log("no", newMessages);
        if (newMessages.length > messageMaxNumber) {  //if messages exceed a limit 
          newMessages.shift();  //deleteing the elements from array
          setMessages(newMessages);
        } else {
          setMessages(newMessages);
        }
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, [props]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">
          <div className="chatrooms">
            {/* {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
          </div>
        ))}           */}
            CHATROOM NAME
          </div>
        </div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {!isURL && (
                <div class="talk-bubble tri-right left-in">
                  <div class="talktext">
                    <p>{message.message}</p>
                  </div>
                </div>
              )}
              {isURL && (
                <div class="talk-bubble tri-right left-in">
                  <div class="talktext">
                    <a href={message.message}>{message.message}</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Type a message..."
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              {/* <FontAwesomeIcon icon="fa-solid fa-paper-plane" /> */}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
