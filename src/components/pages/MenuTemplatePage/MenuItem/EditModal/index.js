import React, { useState } from "react";
import { string, func } from "prop-types";
import { connect } from "react-redux";
import { editService } from "store/actions/menu-template-actions";
import OpCodesSelect from "components/pages/MenuTemplatePage/AddMenuItemModal/OpCodesSelect";
import Modal from "components/common/Modal";

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
    <Modal
      title="Edit"
      cancelButtonText="Cancel"
      submitButtonText="Save"
      size="small"
      onCancel={props.onClose}
      onSubmit={submit}
    >
      <div className="editModalLabel">
        Service name
      </div>
      <input
        className="editModalInput"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="editModalLabel editModalLabelTopMargin">
        Op code
      </div>
      <OpCodesSelect
        showAssigned={props.kind === "extension"}
        opCode={opCode}
        onChange={setOpCode}
      />
    </Modal>
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
