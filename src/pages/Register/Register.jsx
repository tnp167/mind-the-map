import React from "react";
import "./Register.scss";
import Header from "../../components/Header/Header";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

function Register() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div className="block">
        <div className="pic"></div>
        <div className="register">
          <RegisterForm></RegisterForm>
        </div>
      </div>
    </>
  );
}

export default Register;
