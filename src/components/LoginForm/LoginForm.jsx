import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginForm.scss";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import { motion } from "framer-motion";

function LoginForm() {
  const { login, auth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
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
        navigate("/", { state: { toastMessage: "Login successfully" } });
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrors({ invalid: error.response.data.message });
        } else {
          setErrors({ invalid: "Login failed. Please try again" });
        }
      }
    }
  };

  useEffect(() => {
    if (auth.user) {
      navigate("/");
    }
  }, [auth.user]);

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
      {errors.invalid && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="login-form__error login-form__error--invalid"
        >
          {errors.invalid}{" "}
          <span className="login-form__circle">
            {" "}
            <CircleX />
          </span>
        </motion.p>
      )}
    </form>
  );
}

export default LoginForm;
