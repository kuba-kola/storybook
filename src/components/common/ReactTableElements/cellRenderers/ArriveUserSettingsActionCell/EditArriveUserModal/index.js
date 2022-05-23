import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import Input from "components/common/Input";
import closeIcon from "assets/images/close.svg";
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
    <>
      <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
        <div className="menuTemplatesAddTemplateModalHeader">
          Edit arrive user
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
