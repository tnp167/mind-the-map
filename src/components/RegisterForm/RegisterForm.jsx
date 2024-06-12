import { useEffect, useState } from "react";
import "./RegisterForm.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setSuccessMessage(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    // try {
    //   await axios.post(`${process.env.REACT_APP_BASE_URL}/register`, data);
    //   setData({
    //     firstname: "",
    //     lastname: "",
    //     email: "",
    //     password: "",
    //     confirmPassword: "",
    //   });
    //   navigate("/login");
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const validateForm = () => {
    const errors = {};

    if (!data.firstname) {
      errors.firstname = "First name is required";
    }

    if (!data.lastname) {
      errors.lastname = "Last name is required";
    }

    if (!data.email) {
      errors.email = "Email address is required";
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordValidation(validation);
    setErrors({ ...errors, password: validation });
  };

  useEffect(() => {
    validatePassword(data.password);
  }, [data.password]);

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <label className="signup-form__label" htmlFor="firstname">
        First Name
      </label>
      <input
        className={`signup-form__input signu`}
        type="text"
        name="firstname"
        id="firstname"
        placeholder="First Name"
        onChange={handleChange}
        value={data.firstname}
      ></input>
      {errors.firstname && <p>{errors.firstname}</p>}
      <label className="signup-form__label" htmlFor="lastname">
        Last Name
      </label>
      <input
        className="signup-form__input"
        type="text"
        name="lastname"
        id="lastname"
        placeholder="Last Name"
        onChange={handleChange}
        value={data.lastname}
      ></input>
      {errors.lastname && <p>{errors.lastname}</p>}
      <label className="signup-form__label" htmlFor="email">
        Email address
      </label>
      {errors.email && <p>{errors.email}</p>}
      <input
        className="signup-form__input"
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        onChange={handleChange}
        value={data.email}
      ></input>
      <label className="signup-form__label" htmlFor="password">
        Create password
      </label>
      <input
        className="signup-form__input"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        onChange={handleChange}
        value={data.password}
      ></input>
      <p
        className={`${
          passwordValidation.length
            ? "signup-form__valid"
            : "signup-form__invalid"
        }`}
      >
        {" "}
        At least 8 characters
      </p>
      <p
        className={`${
          passwordValidation.uppercase
            ? "signup-form__valid"
            : "signup-form__invalid"
        }`}
      >
        {" "}
        Contains a capital letter
      </p>
      <p
        className={`${
          passwordValidation.lowercase
            ? "signup-form__valid"
            : "signup-form__invalid"
        }`}
      >
        {" "}
        Contains a lower letter
      </p>
      <p
        className={`${
          passwordValidation.number
            ? "signup-form__valid"
            : "signup-form__invalid"
        }`}
      >
        {" "}
        Contains a number
      </p>
      <p
        className={`${
          passwordValidation.special
            ? "signup-form__valid"
            : "signup-form__invalid"
        }`}
      >
        {" "}
        Contains a special character
      </p>
      <label className="signup-form__label" htmlFor="conPassword">
        Confirm password
      </label>
      <input
        className="signup-form__input"
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleChange}
        value={data.confirmPassword}
      ></input>
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      <button type="submit">Register</button>
      {successMessage && <p>Successfully registered!</p>}
    </form>
  );
}

export default RegisterForm;
