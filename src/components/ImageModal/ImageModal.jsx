import Modal from "react-modal";
import React from "react";
import "./ImageModal.scss";
function ImageModal({ imageModalIsOpen }) {
  return (
    <>
      <Modal isOpen={true} className="image-modal">
        <h1>Modal</h1>
      </Modal>
    </>
  );
}

export default ImageModal;
