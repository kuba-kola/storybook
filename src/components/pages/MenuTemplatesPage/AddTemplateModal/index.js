import React, { Component } from "react";
import { bool, func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import { createTemplate } from "store/actions/menu-templates-actions";
import Modal from "components/common/Modal";

import "./styles.scss";

class AddTemplateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", errors: [] };
  }

  submit = () => {
    this.props.onSubmit(this.state.name, this.props.isExtension)
      .then(() => this.props.onClose())
      .catch(({ response: { data: errors } }) => this.setState(errors));
  }

  handleChange = (event) => this.setState({ name: event.target.value });

  render() {
    const { errors } = this.state;
    const { onClose } = this.props;

    return (
      <Modal
        title="New template"
        cancelButtonText="Cancel"
        submitButtonText="Create"
        size="small"
        onCancel={onClose}
        onSubmit={this.submit}
      >
        <div className="addTemplateModalLabel">
          Template name
        </div>
        <input
          className={cx("addTemplateModalInput", { error: errors.length })}
          value={this.state.name}
          onChange={this.handleChange}
        />
        {errors.map((error) => (
          <span key={error} className="addTemplateModalInputError">
            {error}
          </span>
        ))}
      </Modal>
    );
  }
}

AddTemplateModal.propTypes = {
  isExtension: bool.isRequired,
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

const actions = {
  onSubmit: createTemplate,
};

const AddTemplateModalContainer = connect(null, actions)(AddTemplateModal);

export default AddTemplateModalContainer;
