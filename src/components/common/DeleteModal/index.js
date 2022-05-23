import React from "react";
import { func, string } from "prop-types";
import closeIcon from "assets/images/close.svg";
import Button from "components/common/Button";

import "./styles.scss";

const DeleteModal = ({
  text,
  onSubmit,
  onClose,
  children,
}) => (
  <>
    <div className="menuTemplatesDeleteModal">
      <div className="menuTemplatesDeleteModalHeader">
        Wait. Are you sure?
        <button type="button" className="menuTemplatesDeleteModalCloseButton" onClick={onClose}>
          <img alt="close" src={closeIcon} />
        </button>
      </div>
      <div className="menuTemplatesDeleteModalBody">
        <div className="menuTemplatesDeleteModalLabel">
          {text}
        </div>
        <div className="menuTemplatesDeleteModalContent">
          {children}
        </div>
      </div>
      <div className="menuTemplatesDeleteModalFooter">
        <Button className="menuTemplatesDeleteModalCancel" onClick={onClose}>No</Button>
        <Button
          className="menuTemplatesDeleteModalSave"
          onClick={onSubmit}
        >
          Yes
        </Button>
      </div>
    </div>
    <button type="button" className="menuTemplatesDeleteOverlay" />
  </>
);

DeleteModal.propTypes = {
  text: string.isRequired,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

export default DeleteModal;
