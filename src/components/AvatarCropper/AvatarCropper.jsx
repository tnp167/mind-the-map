import { useState, useRef } from "react";
import "./AvatarCropper.scss";
import Modal from "react-modal";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../../setCanvasPreview";
import close from "../../assets/icons/close.svg";

function AvatarCropper({
  imageModalIsOpen,
  handleImageCloseModal,
  updateAvatar,
}) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState("");
  const [crop, setCrop] = useState();
  const selectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < 150 || naturalHeight < 150) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImage("");
        }
      });
      setImage(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const centeredCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: (150 / width) * 100,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(centeredCrop);
  };
  return (
    <>
      <Modal isOpen={imageModalIsOpen} className="avatar">
        <div className="avatar__icon">
          <img
            src={close}
            onClick={handleImageCloseModal}
            alt="close-icon"
            className="modal__close"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={selectFile}
          className="avatar__input"
        />{" "}
        {error && <p className="avatar__error">{error}</p>}
        {image && (
          <div className="avatar__crop">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              circularCrop
              keepSelection
              aspect={1}
              minWidth={150}
            >
              <img
                ref={imgRef}
                src={image}
                alt="avatar"
                className="avatar__image"
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <button
              className="avatar__button"
              onClick={() => {
                setCanvasPreview(
                  imgRef.current,
                  canvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                const dataUrl = canvasRef.current.toDataURL();
                console.log(dataUrl);
                updateAvatar({ picture: dataUrl });
                handleImageCloseModal();
              }}
            >
              Crop Image
            </button>
          </div>
        )}
        {crop && <canvas className="avatar__canvas" ref={canvasRef} />}
      </Modal>
    </>
  );
}

export default AvatarCropper;
