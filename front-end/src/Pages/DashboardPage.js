import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DashboardPage = (props) => {
  const location = useLocation();
  const nameRef = React.createRef();
  const [chatrooms, setChatrooms] = React.useState([]);
  const [userName, setUserName] = React.useState();

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

  const postChatrooms = () => {
    const reqname = nameRef.current.value;
    axios
      .post("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          reqname,
        },
      })
      .then((response) => {
        makeToast("success", response.data.message);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };
  const logout = (props) => {
    localStorage.removeItem("User");
    localStorage.removeItem("CC_Token");
    localStorage.removeItem("chatName");
  };
  React.useEffect(() => {
    if (location.state !== undefined) { //if the path is coming from login page
      setUserName(location.state.data);
    } else {    // else a loggedin user so we get the name from localstorage
      setUserName(localStorage.getItem("User"));
    }
  }, [props]);

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, [props]);

  return (
    <div className="align">
      <div className="mainDiv">
        <div className="welcomeTag">Welcome,</div>
        <div className="username">{userName} </div>
        <Link to={"/login"}>
          <button onClick={logout} className="logoutBtn">
            Logout
          </button>
        </Link>
      </div>
      <div className="card2">
        <div className="cardHeader">Create one</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label htmlFor="chatroomName">Chatroom Name</label>
            <input
              type="text"
              name="chatroomName"
              id="chatroomName"
              placeholder="Enter room name"
            />
          </div>
        </div>
        <button onClick={postChatrooms}>Create Chatroom</button>
      </div>
      <div className="card1">
        <div className="cardHeader">Join a Chatroom</div>
        <div className="chatrooms">
          {chatrooms.map((chatroom) => (
            <div key={chatroom._id} className="chatroom">
              <div>{chatroom.name}</div>
              <Link to={"/chatroom/" + chatroom._id}>
                <div className="join">Join</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
