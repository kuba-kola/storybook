import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import Input from "components/common/Input";
import { createMaintainer } from "store/actions/dealership-details-actions";
import closeIcon from "assets/images/close.svg";

const AddMaintainerModal = ({
  addMaintaner,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const validateErrors = {
      email: !email && "Email must be present.",
    };
    setErrors(validateErrors);
    return !Object.values(validateErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      addMaintaner(email)
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          email: data.email,
        }));
    }
  };

  return (
    <>
      <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
        <div className="menuTemplatesAddTemplateModalHeader">
          New maintainer
          <button type="button" className="menuTemplatesAddTemplateModalCloseButton" onClick={onClose}>
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesAddTemplateModalBody">
          <Input
            inputClassName={cx({ error: !!errors.email })}
            label="Email"
            error={errors.email}
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className="menuTemplatesAddTemplateModalFooter conciergeSettingsAddUserModalFooter">
          <button type="button" className="menuTemplatesAddTemplateModalCancel" onClick={onClose}>Cancel</button>
          <button type="button" className="menuTemplatesAddTemplateModalSave" onClick={submit}>Create</button>
        </div>
      </div>
      <button type="button" className="menuTemplatesAddTemplateOverlay" />
    </>
  );
};

AddMaintainerModal.propTypes = {
  addMaintaner: func.isRequired,
  onClose: func.isRequired,
};

const actions = {
  addMaintaner: createMaintainer,
};

export default connect(null, actions)(AddMaintainerModal);
