import React from "react";
import Header from "../../components/Header/Header";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./Login.scss";
function Login() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div className="picture">
        <div className="container">
          <div className="login">
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
