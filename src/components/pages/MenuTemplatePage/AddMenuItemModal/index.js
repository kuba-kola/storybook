import React, { useState } from "react";
import {
  string, func, arrayOf, number,
} from "prop-types";
import { connect } from "react-redux";
import { menuItemPropType } from "shared/prop-types";
import { addMenuItem } from "store/actions/menu-template-actions";
import Modal from "components/common/Modal";
import ServicesSelect from "./ServicesSelect";
import OpCodesSelect from "./OpCodesSelect";

import "./styles.scss";

const AddMenuItemModal = ({
  kind,
  menuTemplateId,
  excludedServices,
  createMenuItem,
  duplicate,
  onClose,
}) => {
  const [service, setService] = useState("");
  const [opCode, setOpCode] = useState(null);

  const isSaveDisabled = () => !service || (service && service.value === "" && opCode === null);

  const submit = () => {
    createMenuItem({
      menuTemplateId,
      service: {
        id: service.value,
        name: service.label,
        op_code_id: opCode ? opCode.value : null,
        kind,
      },
      duplicate,
    });
    onClose();
  };

  return (
    <Modal
      title={duplicate ? `Duplicate ${duplicate.op_code} - ${duplicate.name}` : "Add a new menu item"}
      cancelButtonText="Cancel"
      submitButtonText="Save"
      submitDisabled={isSaveDisabled()}
      size="small"
      onCancel={onClose}
      onSubmit={submit}
    >
      <div className="addMenuItemModalLabel">
        Service
      </div>
      <ServicesSelect
        service={service}
        kind={kind}
        excludedServices={excludedServices}
        onChange={setService}
      />
      {service && service.value === "" && (
      <>
        <div className="addMenuItemModalLabel addMenuItemModalLabelTopMargin">
          Op code
        </div>
        <OpCodesSelect
          showAssigned={kind === "extension"}
          opCode={opCode}
          onChange={setOpCode}
        />
      </>
      )}
    </Modal>
  );
};

AddMenuItemModal.propTypes = {
  menuTemplateId: number.isRequired,
  kind: string.isRequired,
  onClose: func.isRequired,
  createMenuItem: func.isRequired,
  excludedServices: arrayOf(number),
  duplicate: menuItemPropType,
};

AddMenuItemModal.defaultProps = {
  excludedServices: [],
  duplicate: null,
};

const actions = {
  createMenuItem: addMenuItem,
};

const AddMenuItemModalContainer = connect(null, actions)(AddMenuItemModal);

export default AddMenuItemModalContainer;
