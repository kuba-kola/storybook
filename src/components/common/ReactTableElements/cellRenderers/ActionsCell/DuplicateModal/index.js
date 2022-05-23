import React, { Component } from "react";
import { number, string, func } from "prop-types";
import { connect } from "react-redux";

import { duplicateTemplate } from "store/actions/menu-templates-actions";
import closeIcon from "assets/images/close.svg";

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
      <>
        <div className="menuTemplatesDuplicateModal">
          <div className="menuTemplatesDuplicateModalHeader">
            Duplicate template
            <button type="button" className="menuTemplatesDuplicateModalCloseButton" onClick={onClose}>
              <img alt="close" src={closeIcon} />
            </button>
          </div>
          <div className="menuTemplatesDuplicateModalBody">
            <div className="menuTemplatesDuplicateModalLabel">
              Template name
            </div>
            <input
              className="menuTemplatesDuplicateModalInput"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="menuTemplatesDuplicateModalFooter">
            <button type="button" className="menuTemplatesDuplicateModalCancel" onClick={onClose}>Cancel</button>
            <button type="button" className="menuTemplatesDuplicateModalSave" onClick={this.submit}>Duplicate</button>
          </div>
        </div>
        <button type="button" className="menuTemplatesDuplicateOverlay" />
      </>
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
