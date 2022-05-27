import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import Modal from "components/common/Modal";
import Input from "components/common/Input";
import { createArriveUser } from "store/actions/settings-actions";

const AddArriveUserModal = ({
  addArriveUser,
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
      addArriveUser({ password, email })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          password: data.password,
          email: data.email,
        }));
    }
  };

  return (
    <Modal
      title="New Arrive User"
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

AddArriveUserModal.propTypes = {
  addArriveUser: func,
  onClose: func.isRequired,
};

AddArriveUserModal.defaultProps = {
  addArriveUser: null,
};

const actions = {
  addArriveUser: createArriveUser,
};

export default connect(null, actions)(AddArriveUserModal);
