import React from "react";
import Header from "../../components/Header/Header";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./Login.scss";
function Login() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div className="block">
        <div className="pic"></div>
        <div className="login">
          <LoginForm></LoginForm>
        </div>
      </div>
    </>
  );
}

export default Login;
