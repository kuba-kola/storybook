import React, { Component } from "react";
import { number, string, func } from "prop-types";
import { connect } from "react-redux";
import { updateName } from "store/actions/menu-templates-actions";
import Modal from "components/common/Modal";

import "./styles.scss";

class EditNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
  }

  submit = () => {
    this.props.onSubmit(this.props.id, this.state.name);
    this.props.onClose();
  }

  handleChange = (event) => this.setState({ name: event.target.value });

  render() {
    const { onClose } = this.props;

    return (
      <Modal
        title="Edit name"
        cancelButtonText="Cancel"
        submitButtonText="Save"
        size="small"
        onCancel={onClose}
        onSubmit={this.submit}
      >
        <div className="editNameModalLabel">
          Template name
        </div>
        <input
          className="editNameModalInput"
          value={this.state.name}
          onChange={this.handleChange}
        />
      </Modal>
    );
  }
}

EditNameModal.propTypes = {
  id: number.isRequired,
  name: string.isRequired,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

const actions = {
  onSubmit: updateName,
};

const EditNameModalContainer = connect(null, actions)(EditNameModal);

export default EditNameModalContainer;
