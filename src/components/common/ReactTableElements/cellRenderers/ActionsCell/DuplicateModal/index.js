import React, { Component } from "react";
import { number, string, func } from "prop-types";
import { connect } from "react-redux";
import { duplicateTemplate } from "store/actions/menu-templates-actions";
import Modal from "components/common/Modal";

import "./styles.scss";

class DuplicateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: `${this.props.name}_Copy` };
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
        title="Duplicate template"
        cancelButtonText="Cancel"
        submitButtonText="Duplicate"
        size="small"
        onCancel={onClose}
        onSubmit={this.submit}
      >
        <div className="duplicateModalLabel">
          Template name
        </div>
        <input
          className="duplicateModalInput"
          value={this.state.name}
          onChange={this.handleChange}
        />
      </Modal>
    );
  }
}

DuplicateModal.propTypes = {
  id: number.isRequired,
  name: string.isRequired,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

const actions = {
  onSubmit: duplicateTemplate,
};

const DuplicateModalContainer = connect(null, actions)(DuplicateModal);

export default DuplicateModalContainer;
