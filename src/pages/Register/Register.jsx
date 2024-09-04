import React from "react";
import "./Register.scss";
import Header from "../../components/Header/Header";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

function Register() {
  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div className="pic">
        <div className="container-register">
          <div className="register">
            <RegisterForm></RegisterForm>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
