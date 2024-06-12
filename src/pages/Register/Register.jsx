import React from "react";
import "./Register.scss";
import Header from "../../components/Header/Header";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

function Register() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <RegisterForm></RegisterForm>
    </>
  );
}

export default Register;
