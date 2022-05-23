import React, { useState } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import Input from "components/common/Input";
import Select from "react-select";
import { createUser } from "store/actions/settings-actions";
import { fullNameValidator, emailValidator } from "shared/validators";
import closeIcon from "assets/images/close.svg";

const roleOptions = {
  admin: {
    label: "Manager / Admin",
    value: "dealership_admin",
  },
  advisor: {
    label: "Advisor",
    value: "advisor",
  },
  bdc: {
    label: "BDC",
    value: "bdc",
  },
};

const AddEmployeeModal = ({
  onClose,
  addUser,
}) => {
  const [fields, setFields] = useState({
    name: "",
    employee_number: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const {
      name, employee_number, email, role,
    } = fields;
    if (validate()) {
      addUser({
        name, employee_number, email, role: role.value,
      })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          name: data.name,
          employee_number: data.employee_number,
          email: data.email,
          role: data.role,
        }));
    }
  };

  const validate = () => {
    const { name, email } = fields;
    const errors = {
      name: !fullNameValidator(name) && "A full name must be present.",
      email: !emailValidator(email) && "Invalid email address",
    };
    setErrors(errors);
    return !Object.values(errors).find((v) => v);
  };

  const setField = (field, value) => setFields((prevState) => ({
    ...prevState,
    [field]: value,
  }));

  return (
    <>
      <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
        <div className="menuTemplatesAddTemplateModalHeader">
          New user
          <button type="button" className="menuTemplatesAddTemplateModalCloseButton" onClick={onClose}>
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <div className="menuTemplatesAddTemplateModalBody">
          <Input
            inputClassName={cx({ error: !!errors.name })}
            label="Full name"
            error={errors.name}
            value={fields.name}
            onChange={(value) => setField("name", value)}
          />
          <Input
            inputClassName={cx({ error: !!errors.employee_number })}
            label="Employee Number"
            error={errors.employee_number}
            value={fields.employee_number}
            onChange={(value) => setField("employee_number", value)}
          />
          <Input
            inputClassName={cx({ error: !!errors.email })}
            label="Email"
            error={errors.email}
            value={fields.email}
            onChange={(value) => setField("email", value)}
          />
          <Select
            value={fields.role}
            options={Object.values(roleOptions)}
            onChange={(value) => setField("role", value)}
            className="addMenuItemSelectContainer"
            classNamePrefix="addMenuItemSelect"
            placeholder="Role"
            menuPlacement="top"
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

export default connect(null, {
  addUser: createUser,
})(AddEmployeeModal);
