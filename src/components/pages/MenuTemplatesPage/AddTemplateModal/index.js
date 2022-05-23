import React, { Component } from "react";
import { bool, func } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { createTemplate } from "store/actions/menu-templates-actions";
import closeIcon from "assets/images/close.svg";

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
      <>
        <div className="menuTemplatesAddTemplateModal">
          <div className="menuTemplatesAddTemplateModalHeader">
            New template
            <button type="button" className="menuTemplatesAddTemplateModalCloseButton" onClick={onClose}>
              <img alt="close" src={closeIcon} />
            </button>
          </div>
          <div className="menuTemplatesAddTemplateModalBody">
            <div className="menuTemplatesAddTemplateModalLabel">
              Template name
            </div>
            <input
              className={cx("menuTemplatesAddTemplateModalInput", { error: errors.length })}
              value={this.state.name}
              onChange={this.handleChange}
            />
            {errors.map((error) => (
              <span key={error} className="menuTemplatesAddTemplateModalInputError">
                {error}
              </span>
            ))}
          </div>
          <div className="menuTemplatesAddTemplateModalFooter">
            <button type="button" className="menuTemplatesAddTemplateModalCancel" onClick={onClose}>Cancel</button>
            <button type="button" className="menuTemplatesAddTemplateModalSave" onClick={this.submit}>Create</button>
          </div>
        </div>
        <button type="button" className="menuTemplatesAddTemplateOverlay" />
      </>
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
