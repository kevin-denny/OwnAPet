import React from "react";
import { Modal } from "react-bootstrap";

const CommonModal = ({ children, size, title, showModal, handleClose }) => {
  return (
    <Modal size={size ? size : "sm"} show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CommonModal;
