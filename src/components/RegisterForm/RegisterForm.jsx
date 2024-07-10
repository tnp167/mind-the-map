import { useEffect, useState } from "react";
import "./RegisterForm.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
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
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/user/register`,
          data
        );
        setData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setSuccessMessage(true);
        setModal(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
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

    const passwordValidated = validatePassword(data.password);
    if (Object.values(passwordValidated).includes(false)) {
      errors.password = "Password does not meet the requirements";
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
    //setErrors({ ...errors, password: validation });
    return validation;
  };

  useEffect(() => {
    validatePassword(data.password);
  }, [data.password]);

  // useEffect(() => {
  //   console.log(passwordValidation);
  // });
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <p className="signup-form__title">Register</p>
      <div className="signup-form__group signup-form__group--name">
        <div className="signup-form__name">
          <label className="signup-form__label" htmlFor="firstname">
            First Name
          </label>
          <input
            className={`signup-form__input ${
              errors.firstname && "signup-form__input--error"
            }`}
            type="text"
            name="firstname"
            id="firstname"
            placeholder="First Name"
            onChange={handleChange}
            value={data.firstname}
          ></input>
          {errors.firstname && (
            <p className="signup-form__error">{errors.firstname}</p>
          )}
        </div>
        <div className="signup-form__name">
          <label className="signup-form__label" htmlFor="lastname">
            Last Name
          </label>
          <input
            className={`signup-form__input ${
              errors.lastname && "signup-form__input--error"
            }`}
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            value={data.lastname}
          ></input>
          {errors.lastname && (
            <p className="signup-form__error">{errors.lastname}</p>
          )}
        </div>
      </div>
      <div className="signup-form__group">
        <label className="signup-form__label" htmlFor="email">
          Email address
        </label>
        <input
          className={`signup-form__input ${
            errors.email && "signup-form__input--error"
          }`}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          value={data.email}
        ></input>
        {errors.email && <p className="signup-form__error">{errors.email}</p>}
      </div>
      <div className="signup-form__group">
        <label className="signup-form__label" htmlFor="password">
          Create password
        </label>
        <input
          className={`signup-form__input ${
            errors.password && "signup-form__input--error"
          }`}
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
        ></input>
        <div className="signup-form__checkbox">
          <input type="checkbox" onClick={togglePasswordVisibility} />
          Show Password
        </div>
        {/* <div onClick={togglePasswordVisibility} className="signup-form__icon">
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </div> */}
        {errors.password && (
          <p className="signup-form__error">{errors.password}</p>
        )}
      </div>
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
      <div className={`signup-form__group signup-form__group--confirm`}>
        <label className="signup-form__label" htmlFor="conPassword">
          Confirm password
        </label>
        <input
          className={`signup-form__input ${
            errors.confirmPassword && "signup-form__input--error"
          }`}
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={data.confirmPassword}
        ></input>
        {errors.confirmPassword && (
          <p className="signup-form__error">{errors.confirmPassword}</p>
        )}
      </div>
      {/* {successMessage ? (
        <p className="signup-form__success">Successfully registered!</p>
      ) : (
        <button type="submit" className="signup-form__button">
          Register
        </button>
      )} */}
      <button type="submit" className="signup-form__button">
        Register
      </button>
      <p className="signup-form__login">
        Already have an account?{" "}
        <Link to="/login" className="signup-form__link">
          Login
        </Link>{" "}
        using your account
      </p>
      {successMessage && (
        <Modal
          isOpen={modal}
          contentLabel="Success Modal"
          className="signup-form__modal"
        >
          <h2 className="signup-form__message">Successfully registered!</h2>
        </Modal>
      )}
    </form>
  );
}

export default RegisterForm;
