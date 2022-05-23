import React, { useState } from "react";
import { string, func } from "prop-types";
import { connect } from "react-redux";

import { editService } from "store/actions/menu-template-actions";
import closeIcon from "assets/images/close.svg";
import OpCodesSelect from "components/pages/MenuTemplatePage/AddMenuItemModal/OpCodesSelect";

import "./styles.scss";

const EditModal = (props) => {
  const [name, setName] = useState(props.name);
  const [opCode, setOpCode] = useState(null);

  const submit = () => {
    if (opCode) {
      props.onSubmit({
        ...props, name, opCodeId: opCode.value, opCodeName: opCode.code,
      });
    } else {
      props.onSubmit({ ...props, name });
    }
    props.onClose();
  };

  return (
    <>
      <div className="menuTemplatesEditModal">
        <div className="menuTemplatesEditModalHeader">
          Edit
          <button type="button" className="menuTemplatesEditModalCloseButton" onClick={props.onClose}>
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesEditModalBody">
          <div className="menuTemplatesEditModalLabel">
            Service name
          </div>
          <input
            className="menuTemplatesEditModalInput"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="menuTemplatesAddMenuItemModalLabel menuTemplatesAddMenuItemModalLabel--topMargin">
            Op code
          </div>
          <OpCodesSelect
            showAssigned={props.kind === "extension"}
            opCode={opCode}
            onChange={setOpCode}
          />
        </div>
        <div className="menuTemplatesEditModalFooter">
          <button type="button" className="menuTemplatesEditModalCancel" onClick={props.onClose}>Cancel</button>
          <button type="button" className="menuTemplatesEditModalSave" onClick={submit}>Save</button>
        </div>
      </div>
      <button type="button" className="menuTemplatesEditNameOverlay" />
    </>
  );
};

EditModal.propTypes = {
  kind: string.isRequired,
  name: string.isRequired,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

const actions = {
  onSubmit: editService,
};

const EditModalContainer = connect(null, actions)(EditModal);

export default EditModalContainer;
