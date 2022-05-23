import React, { useState } from "react";
import {
  string, func, arrayOf, number,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { menuItemPropType } from "shared/prop-types";
import { addMenuItem } from "store/actions/menu-template-actions";
import closeIcon from "assets/images/close.svg";
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
    <>
      <div className="menuTemplatesAddMenuItemModal">
        <div className="menuTemplatesAddMenuItemModalHeader">
          {duplicate ? `Duplicate ${duplicate.op_code} - ${duplicate.name}` : "Add a new menu item"}
          <button type="button" className="menuTemplatesAddMenuItemModalCloseButton" onClick={onClose}>
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesAddMenuItemModalBody">
          <div className="menuTemplatesAddMenuItemModalLabel">
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
              <div className="menuTemplatesAddMenuItemModalLabel menuTemplatesAddMenuItemModalLabel--topMargin">
                Op code
              </div>
              <OpCodesSelect
                showAssigned={kind === "extension"}
                opCode={opCode}
                onChange={setOpCode}
              />
            </>
          )}
        </div>
        <div className="menuTemplatesAddMenuItemModalFooter">
          <button type="button" className="menuTemplatesAddMenuItemModalCancel" onClick={onClose}>Cancel</button>
          <button type="button" className={cx("menuTemplatesAddMenuItemModalSave", { "menuTemplatesAddMenuItemModalSave--disabled": isSaveDisabled() })} onClick={submit} disabled={isSaveDisabled()}>Save</button>
        </div>
      </div>
      <button type="button" className="menuTemplatesEditNameOverlay" />
    </>
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
