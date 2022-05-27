import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import Input from "components/common/Input";
import { updateEmployee } from "store/actions/settings-actions";
import { settingsEmploymentsSelector } from "store/selectors/settings-selectors";
import Modal from "components/common/Modal";

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

const EditEmployeeModal = ({
  id, employments, onClose, changeUser,
}) => {
  const [fields, setFields] = useState({
    name: "",
    employee_number: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const currentEmployment = employments.find((employment) => employment.id === id);
    if (currentEmployment) {
      setFields({ ...currentEmployment, role: currentEmployment.role ? roleOptions[currentEmployment.role] : "" });
    }
  }, []);

  const submit = () => {
    changeUser({ ...fields, role: fields.role.value });
    onClose();
  };

  const setField = (field, value) => setFields((prevState) => ({
    ...prevState,
    [field]: value,
  }));

  return (
    <Modal
      title="Edit user"
      cancelButtonText="Cancel"
      submitButtonText="Save"
      size="small"
      onCancel={onClose}
      onSubmit={submit}
    >
      <Input
        label="Full name"
        value={fields.name}
        onChange={(value) => setField("name", value)}
      />
      <Input
        label="Employee number"
        value={fields.employee_number}
        onChange={(value) => setField("employee_number", value)}
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
    </Modal>
  );
};

EditEmployeeModal.propTypes = {
  changeUser: func,
  onClose: func.isRequired,
  id: number.isRequired,
  employments: arrayOf(shape({
    id: number.isRequired,
    dealership_id: number.isRequired,
    name: string,
    username: string,
    email: string,
    created_at: string,
    updated_at: string,
  })),
};

EditEmployeeModal.defaultProps = {
  changeUser: null,
  employments: [],
};

const mapStateToProps = (state) => ({
  employments: settingsEmploymentsSelector(state),
});

const actions = {
  changeUser: updateEmployee,
};

export default connect(mapStateToProps, actions)(EditEmployeeModal);
