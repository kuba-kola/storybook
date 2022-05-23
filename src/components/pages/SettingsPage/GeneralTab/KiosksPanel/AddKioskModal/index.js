import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import Input from "components/common/Input";
import Modal from "components/common/Modal";
import { createKiosk } from "store/actions/settings-actions";

const AddKioskModal = ({
  addArriveUser,
  onClose,
}) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const validateErrors = {
      password: !password && "Password must be present.",
      username: !username && "Username must be present.",
    };
    setErrors(validateErrors);
    return !Object.values(validateErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      addArriveUser({ password, username })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          password: data.password,
          username: data.username,
        }));
    }
  };

  return (
    <Modal
      title="New Kiosk User"
      onCancel={onClose}
      onSave={submit}
    >
      <Input
        inputClassName={cx({ error: !!errors.username })}
        label="Username"
        error={errors.username}
        value={username}
        onChange={setUsername}
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

AddKioskModal.propTypes = {
  addKiosk: func,
  onClose: func.isRequired,
};

AddKioskModal.defaultProps = {
  addKiosk: null,
};

const actions = {
  addKiosk: createKiosk,
};

export default connect(null, actions)(AddKioskModal);
