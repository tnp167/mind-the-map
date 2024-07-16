import { useState, useRef } from "react";
import "./AvatarCropper.scss";
import Modal from "react-modal";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";

function AvatarCropper({ imageModalIsOpen }) {
  const [error, setError] = useState(null);
  const selectFile = (e) => {};
  return (
    <>
      <Modal isOpen={true} className="image-modal">
        <input
          type="file"
          accept="image/*"
          onChange={selectFile}
          className="avatar__input"
        />
      </Modal>
    </>
  );
}

export default AvatarCropper;
