import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import Input from "components/common/Input";
import { createMaintainer } from "store/actions/dealership-details-actions";
import Modal from "components/common/Modal";

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
    <Modal
      title="New maintainer"
      cancelButtonText="Cancel"
      submitButtonText="Create"
      size="small"
      onCancel={onClose}
      onSubmit={submit}
    >
      <Input
        inputClassName={cx({ error: !!errors.email })}
        label="Email"
        error={errors.email}
        value={email}
        onChange={setEmail}
      />
    </Modal>
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
