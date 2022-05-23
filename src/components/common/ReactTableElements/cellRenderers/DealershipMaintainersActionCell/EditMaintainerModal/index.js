import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import { dealershipDetailsMaintainersSelector } from "store/selectors/dealership-details-selectors";
import { updateMaintainer } from "store/actions/dealership-details-actions";
import Input from "components/common/Input";
import closeIcon from "assets/images/close.svg";

const EditMaintainerModal = ({
  id,
  maintainers,
  changeMaintainerData,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentMaintainer = maintainers.find((user) => user.id === id);
    if (currentMaintainer) {
      setEmail(currentMaintainer.email);
    }
  }, [maintainers]);

  const validate = () => {
    const validationErrors = {
      email: !email && "Email must be present.",
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      changeMaintainerData(id, email)
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
          Edit dealearship maintainer
          <button
            type="button"
            className="menuTemplatesAddTemplateModalCloseButton"
            onClick={onClose}
          >
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesAddTemplateModalBody">
          <Input
            label="Email"
            value={email}
            error={errors.email}
            onChange={setEmail}
          />
        </div>
        <div className="menuTemplatesAddTemplateModalFooter conciergeSettingsAddUserModalFooter">
          <button
            type="button"
            className="menuTemplatesAddTemplateModalCancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="menuTemplatesAddTemplateModalSave"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
      <button type="button" className="menuTemplatesAddTemplateOverlay" />
    </>
  );
};

EditMaintainerModal.propTypes = {
  id: number.isRequired,
  onClose: func.isRequired,
  changeMaintainerData: func.isRequired,
  maintainers: arrayOf(shape({
    email: string.isRequired,
    id: string.isRequired,
  })),
};

EditMaintainerModal.defaultProps = {
  maintainers: [],
};

const mapStateToProps = (state) => ({
  maintainers: dealershipDetailsMaintainersSelector(state),
});

const actions = {
  changeMaintainerData: updateMaintainer,
};

export default connect(mapStateToProps, actions)(EditMaintainerModal);
