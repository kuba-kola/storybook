import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import Modal from "components/common/Modal";
import Input from "components/common/Input";
import { createTvScreen } from "store/actions/settings-actions";

const AddTvScreenModal = ({
  addTvScreen,
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
      addTvScreen({ password, username })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          password: data.password,
          username: data.username,
        }));
    }
  };

  return (
    <Modal
      title="New Tv Screen User"
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

AddTvScreenModal.propTypes = {
  addTvScreen: func,
  onClose: func.isRequired,
};

AddTvScreenModal.defaultProps = {
  addTvScreen: null,
};

const actions = {
  addTvScreen: createTvScreen,
};

export default connect(null, actions)(AddTvScreenModal);
