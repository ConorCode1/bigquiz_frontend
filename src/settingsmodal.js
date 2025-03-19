import React from "react";
import { Modal, Button } from "react-bootstrap";

const SettingsModal = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose} className="settings-modal">
      <Modal.Header className="settings-modal-header">
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="settings-modal-body">
        {/* Insert settings form or content here */}
      </Modal.Body>
      <Modal.Footer className="settings-modal-footer">
        <Button
          variant="secondary"
          onClick={onClose}
          className="settings-modal-close-button"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
