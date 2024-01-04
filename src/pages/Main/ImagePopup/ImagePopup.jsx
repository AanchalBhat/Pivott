import { IconButton, Modal } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function ImagePopup({ imageUrl, onClose }) {
  return (
    <Modal open={!!imageUrl} onClose={onClose} onClick={onClose}>
      <div className="image-popup">
        <img src={imageUrl} alt="Popup" />
        <IconButton
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            background: "#fff",
            borderRadius: "50%",
            opacity: "0.9",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </Modal>
  );
}
