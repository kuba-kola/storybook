import React, { useState, useEffect } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";
import { dealershipDetailsMaintainersSelector } from "store/selectors/dealership-details-selectors";
import { updateMaintainer } from "store/actions/dealership-details-actions";
import Input from "components/common/Input";
import Modal from "components/common/Modal";

const EditMaintainerModal = ({
  id,
  maintainers,
  changeMaintainerData,
  onClose,
}) => {
  const [email, setEmail] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentMaintainer = maintainers.find((user) => user.id === id);
    if (currentMaintainer) {
      setEmail(currentMaintainer.email);
    }
  }, [maintainers]);

  const validate = () => {
    const validationErrors = {
      email: !email && "Email must be present.",
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).find((v) => v);
  };

  const submit = () => {
    if (validate()) {
      changeMaintainerData(id, email)
        .then(() => onClose())
        .catch(({ response: { data } }) => setErrors({
          email: data.email,
        }));
    }
  };

  return (
    <Modal
      title="Edit dealearship maintainer"
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
    </Modal>
  );
};

EditMaintainerModal.propTypes = {
  id: number.isRequired,
  onClose: func.isRequired,
  changeMaintainerData: func.isRequired,
  maintainers: arrayOf(shape({
    email: string.isRequired,
    id: string.isRequired,
  })),
};

EditMaintainerModal.defaultProps = {
  maintainers: [],
};

const mapStateToProps = (state) => ({
  maintainers: dealershipDetailsMaintainersSelector(state),
});

const actions = {
  changeMaintainerData: updateMaintainer,
};

export default connect(mapStateToProps, actions)(EditMaintainerModal);
