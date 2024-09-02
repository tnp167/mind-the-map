import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginForm.scss";
import { AuthContext } from "../../contexts/AuthContext";
function LoginForm() {
  const { login, auth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!data.email) {
      errors.email = "Email address is required";
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/user/login`,
          data
        );
        login(response.data.token);
        setData({
          email: "",
          password: "",
        });
        console.log(auth);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <p className="login-form__title">Login</p>
      <div className="login-form__group">
        <label className="login-form__label" htmlFor="email">
          Email address
        </label>
        <input
          className={`login-form__input ${
            errors.email && "login-form__input--error"
          }`}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          value={data.email}
        ></input>
        {errors.email && <p className="login-form__error">{errors.email}</p>}
      </div>
      <div className="login-form__group">
        <label className="login-form__label" htmlFor="password">
          Password
        </label>
        <input
          className={`login-form__input ${
            errors.password && "login-form__input--error"
          }`}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
        ></input>
        <div className="login-form__checkbox">
          <input type="checkbox" onClick={togglePasswordVisibility} />
          Show Password
        </div>
        {errors.password && (
          <p className="login-form__error">{errors.password}</p>
        )}
      </div>
      <button type="submit" className="login-form__button">
        Login
      </button>
      <p className="login-form__login">
        Don't have an account?{" "}
        <Link to="/register" className="login-form__link">
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
