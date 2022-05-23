import React from "react";
import { func, node, string } from "prop-types";

import closeIcon from "assets/images/close.svg";

// #todo apply this modal for user modals in app
const Modal = ({
  title,
  children,
  onCancel,
  onSave,
}) => (
  <>
    <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
      <div className="menuTemplatesAddTemplateModalHeader">
        {title}
        <button type="button" className="menuTemplatesAddTemplateModalCloseButton" onClick={onCancel}>
          <img alt="close" src={closeIcon} />
        </button>
      </div>
      <div className="menuTemplatesAddTemplateModalBody">
        {children}
      </div>
      <div className="menuTemplatesAddTemplateModalFooter">
        <button
          type="button"
          className="menuTemplatesAddTemplateModalCancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="menuTemplatesAddTemplateModalSave"
          onClick={onSave}
        >
          Create
        </button>
      </div>
    </div>

    <button type="button" className="menuTemplatesAddTemplateOverlay" />
  </>
);

Modal.propTypes = {
  title: string,
  children: node,
  onCancel: func.isRequired,
  onSave: func.isRequired,
};

Modal.defaultProps = {
  title: "",
  children: null,
};

export default Modal;
