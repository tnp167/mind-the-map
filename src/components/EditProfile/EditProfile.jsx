import React from "react";
import Modal from "react-modal";
import "./EditProfile.scss";
import close from "../../assets/icons/close.svg";
function EditProfile({ modalIsOpen, handleCloseModal, handleEdit }) {
  return (
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
      <div className="modal__container">
        <div className="modal__wrap">
          <h3 className="modal__title">Profile</h3>
        </div>
        <div className="modal__btn">
          <button className="modal__cancel" onClick={handleCloseModal}>
            cancel
          </button>
          <button onClick={handleEdit} className="modal__delete">
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditProfile;
