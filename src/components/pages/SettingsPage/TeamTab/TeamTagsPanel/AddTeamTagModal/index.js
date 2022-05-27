import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import { createTeamTag } from "store/actions/settings-actions";
import cx from "classnames";
import Input from "components/common/Input";
import Modal from "components/common/Modal";

const AddTeamTagModal = ({
  onClose,
  addTeamTag,
}) => {
  const [fields, setFields] = useState({
    name: "",
    expectedUpsell: 0,
    members: [],
  });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const { name, expectedUpsell } = fields;
    if (validate()) {
      addTeamTag({ name, expected_upsell: +expectedUpsell })
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          name: data.name,
          expectedUpsell: data.expected_upsell,
          members: data.members,
        }));
    }
  };

  const validate = () => {
    const { name, expectedUpsell } = fields;
    const errors = {
      name: !name && "Name must be present.",
      expectedUpsell: (expectedUpsell === undefined || expectedUpsell < 0) && "Expected Upcell must be present and positive.",
    };
    setErrors(errors);
    return !Object.values(errors).find((v) => v);
  };

  const setField = (field, value) => setFields((prevState) => ({
    ...prevState,
    [field]: value,
  }));

  return (
    <Modal
      title="New team tag"
      cancelButtonText="Cancel"
      submitButtonText="Create"
      size="small"
      onCancel={onClose}
      onSubmit={submit}
    >
      <Input
        inputClassName={cx({ error: !!errors.name })}
        label="Name"
        error={errors.name}
        value={fields.name}
        onChange={(value) => setField("name", value)}
      />
      <Input
        inputClassName={cx({ error: !!errors.expectedUpsell })}
        type="number"
        step="0.1"
        max="20"
        min="0"
        label="Expected Upsell"
        error={errors.expectedUpsell}
        value={fields.expectedUpsell}
        onChange={(value) => value >= 0 && setField("expectedUpsell", value)}
      />
    </Modal>
  );
};

AddTeamTagModal.propTypes = {
  onClose: func.isRequired,
  addTeamTag: func.isRequired,
};

export default connect(null, {
  addTeamTag: createTeamTag,
})(AddTeamTagModal);
