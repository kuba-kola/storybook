import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import Modal from "components/common/Modal";
import Input from "components/common/Input";
import { createRemoteUser } from "store/actions/settings-actions";

const AddRemoteUserModal = ({
  addRemoteUser,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const validateErrors = {
      password: !password && "Password must be present.",
      email: !email && "Email must be present.",
    };
    setErrors(validateErrors);
    return !Object.values(validateErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      addRemoteUser({ password, email })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          password: data.password,
          email: data.email,
        }));
    }
  };

  return (
    <Modal
      title="New Remote User"
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
      <Input
        inputClassName={cx({ error: !!errors.password })}
        label="Password"
        error={errors.password}
        value={password}
        onChange={setPassword}
      />
    </Modal>
  );
};

AddRemoteUserModal.propTypes = {
  addRemoteUser: func,
  onClose: func.isRequired,
};

AddRemoteUserModal.defaultProps = {
  addRemoteUser: null,
};

const actions = {
  addRemoteUser: createRemoteUser,
};

export default connect(null, actions)(AddRemoteUserModal);
