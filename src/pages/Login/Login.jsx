import React from "react";
import Header from "../../components/Header/Header";
import LoginForm from "../../components/LoginForm/LoginForm";

function Login() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <LoginForm></LoginForm>
    </>
  );
}

export default Login;
