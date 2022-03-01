import React from "react";
import makeToast from "../Toaster";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const LoginPage = (props) => {
  let history = useHistory();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        makeToast("success", response.data.message);
        history.push({
          pathname: "/dashboard",
          state: { data: response.data.userName },
        });
        localStorage.setItem("CC_Token", response.data.token);
        localStorage.setItem("User", response.data.userName);

        props.setupSocket();
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="background">
      <div className="card">
        <div className="cardHeader">Login</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="abc@example.com"
              ref={emailRef}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              ref={passwordRef}
            />
          </div>
          <button onClick={loginUser}>Login</button>
          <Link to={"/register"}>
            <span className="linkPage">
              <i>Register yourself</i>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
