import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";
import Input from "components/common/Input";
import Modal from "components/common/Modal";
import { settingsArriveUsersSelector } from "store/selectors/settings-selectors";
import { updateArriveUser } from "store/actions/settings-actions";

const EditArriveUserModal = ({
  id,
  arriveUsers,
  changeArriveUser,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentArriveUser = arriveUsers.find((user) => user.id === id);
    if (currentArriveUser) {
      setEmail(currentArriveUser.email);
      setPassword(currentArriveUser.decrypted_password);
    }
  }, [arriveUsers]);

  const validate = () => {
    const validationErrors = {
      email: !email && "Email must be present.",
      password: !password && "Password must be present.",
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      changeArriveUser(id, { email, password })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          email: data.email,
          password: data.password,
        }));
    }
  };

  return (
    <Modal
      title="Edit arrive user"
      cancelButtonText="Cancel"
      submitButtonText="Save"
      size="small"
      onCancel={onClose}
      onSubmit={submit}
    >
      <Input
        label="Email"
        value={email}
        error={errors.email}
        onChange={setEmail}
      />
      <Input
        label="Password"
        value={password}
        error={errors.password}
        onChange={setPassword}
      />
    </Modal>
  );
};

EditArriveUserModal.propTypes = {
  id: number.isRequired,
  onClose: func.isRequired,
  changeArriveUser: func.isRequired,
  arriveUsers: arrayOf(shape({
    email: string.isRequired,
    password: string.isRequired,
  })),
};

EditArriveUserModal.defaultProps = {
  arriveUsers: [],
};

const mapStateToProps = (state) => ({
  arriveUsers: settingsArriveUsersSelector(state),
});

const actions = {
  changeArriveUser: updateArriveUser,
};

export default connect(mapStateToProps, actions)(EditArriveUserModal);
