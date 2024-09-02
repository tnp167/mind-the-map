import React from "react";
import Modal from "react-modal";
import "./SavedRoutes.scss";
import close from "../../assets/icons/close.svg";

function SavedRoutes({ modalIsOpen, handleCloseModal }) {
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
      <div className="modal__wrap">
        <h3 className="modal__title">Saved Routes</h3>
      </div>
    </Modal>
  );
}

export default SavedRoutes;
