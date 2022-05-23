import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import Input from "components/common/Input";
import closeIcon from "assets/images/close.svg";
import { settingsRemoteUsersSelector } from "store/selectors/settings-selectors";
import { updateRemoteUser } from "store/actions/settings-actions";

const EditArriveUserModal = ({
  id,
  remoteUsers,
  changeArriveUser,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentRemoteUser = remoteUsers.find((user) => user.id === id);
    if (currentRemoteUser) {
      setEmail(currentRemoteUser.email);
      setPassword(currentRemoteUser.decrypted_password);
    }
  }, [remoteUsers]);

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
    <>
      <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
        <div className="menuTemplatesAddTemplateModalHeader">
          Edit remote user
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
          <Input
            label="Password"
            value={password}
            error={errors.password}
            onChange={setPassword}
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

EditArriveUserModal.propTypes = {
  id: number.isRequired,
  onClose: func.isRequired,
  changeArriveUser: func.isRequired,
  remoteUsers: arrayOf(shape({
    email: string.isRequired,
    password: string.isRequired,
  })),
};

EditArriveUserModal.defaultProps = {
  remoteUsers: [],
};

const mapStateToProps = (state) => ({
  remoteUsers: settingsRemoteUsersSelector(state),
});

const actions = {
  changeArriveUser: updateRemoteUser,
};

export default connect(mapStateToProps, actions)(EditArriveUserModal);
