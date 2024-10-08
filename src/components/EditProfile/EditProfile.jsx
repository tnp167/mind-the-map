import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import "./EditProfile.scss";
import close from "../../assets/icons/close.svg";
import userIcon from "../../assets/icons/user.png";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import editIcon from "../../assets/icons/edit-button.svg";
import AvatarCropper from "../AvatarCropper/AvatarCropper";

function EditProfile({ modalIsOpen, handleCloseModal }) {
  const { setAuth, auth } = useContext(AuthContext);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);

  const handleImageOpenModal = () => setImageModalIsOpen(true);

  const handleImageCloseModal = () => setImageModalIsOpen(false);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/check-username/${e.target.value}`
        );
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.log("Error checking username", error);
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

    return errors;
  };

  useEffect(() => {
    if (auth.user) {
      setData({
        firstname: auth.user.user.first_name,
        lastname: auth.user.user.last_name,
        username: auth.user.user.username,
      });
    }
  }, [auth.user]);

  const handleEdit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/user/${auth.user?.user.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const updatedUserData = response.data.user;
        const newToken = response.data.token;

        setAuth({
          isAuthenticated: true,
          user: {
            user: {
              ...auth.user.user,
              first_name: updatedUserData.first_name,
              last_name: updatedUserData.last_name,
              username: updatedUserData.username,
            },
          },
        });

        setData({
          firstname: updatedUserData.first_name,
          lastname: updatedUserData.last_name,
          username: updatedUserData.username,
        });

        localStorage.setItem("authToken", newToken);
        handleCloseModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateAvatar = async ({ picture }) => {
    const byteString = atob(picture.split(",")[1]);
    const mimeString = picture.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const formData = new FormData();
    formData.append("picture", blob, "profile-picture.png");

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/${auth.user?.user.id}/picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const newToken = response.data.token;

      setAuth({
        isAuthenticated: true,
        user: {
          user: {
            ...auth.user.user,
            picture: response.data.user.picture,
            pictureUrl: response.data.user.pictureUrl,
          },
        },
      });
      localStorage.setItem("authToken", newToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="Overlay"
      >
        <div className="modal__icon">
          <img
            src={close}
            onClick={handleCloseModal}
            alt="close-icon"
            className="modal__close"
          />
        </div>
        <form className="modal__container" onSubmit={handleEdit}>
          <div className="modal__wrap">
            <h3 className="modal__title">Edit Profile</h3>
          </div>
          <div className="modal__main">
            <div className="modal__pic">
              <img
                src={`${
                  auth.user?.user.pictureUrl
                    ? auth.user?.user.pictureUrl
                    : userIcon
                } `}
                alt="user"
                className={`modal__user ${
                  auth.user?.user.pictureUrl ? "modal__user--update" : ""
                }`}
              />
              <img
                src={editIcon}
                alt="editIcon"
                className={`${
                  !usernameAvailable && "modal__edit--error"
                } modal__edit`}
                onClick={handleImageOpenModal}
              />
            </div>
            <div className="modal__data">
              <div className="modal__group modal__group--name">
                <div className="modal__name">
                  <label className="modal__label" htmlFor="fistname">
                    First Name
                  </label>
                  <input
                    className={`modal__input ${
                      errors.firstname ? "modal__input--error" : ""
                    }`}
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={data.firstname}
                  ></input>
                  {errors.firstname && (
                    <p className="modal__error">{errors.firstname}</p>
                  )}
                </div>
                <div className="modal__name">
                  <label className="modal__label" htmlFor="lastname">
                    Last Name
                  </label>
                  <input
                    className={`modal__input ${
                      errors.lastname && "modal__input--error"
                    }`}
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={data.lastname}
                  ></input>
                  {errors.lastname && (
                    <p className="modal__error">{errors.lastname}</p>
                  )}
                </div>
              </div>
              <div className="modal__group">
                <label className="modal__label" htmlFor="lastname">
                  Username
                </label>
                <input
                  className={`modal__input ${
                    usernameAvailable ? "" : "modal__input--error"
                  }`}
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  value={data.username}
                ></input>
                {!usernameAvailable && (
                  <p className="modal__error">Username already exists</p>
                )}
              </div>
              <div className="modal__group">
                <label className="modal__label" htmlFor="lastname">
                  Email
                </label>
                <input
                  className={`modal__input ${
                    errors.email && "modal__input--error"
                  }`}
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={auth.user?.user.email}
                  disabled={true}
                ></input>
              </div>
            </div>
          </div>
          <div className="modal__btn">
            <button
              className="modal__button modal__button--cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__button modal__button--delete"
              disabled={!usernameAvailable}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
      {imageModalIsOpen && (
        <AvatarCropper
          handleImageOpenModal={handleImageOpenModal}
          imageModalIsOpen={imageModalIsOpen}
          handleImageCloseModal={handleImageCloseModal}
          updateAvatar={updateAvatar}
        />
      )}
    </>
  );
}

export default EditProfile;
