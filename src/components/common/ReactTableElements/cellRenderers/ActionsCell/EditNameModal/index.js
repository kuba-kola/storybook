import React, { Component } from "react";
import { number, string, func } from "prop-types";
import { connect } from "react-redux";

import { updateName } from "store/actions/menu-templates-actions";
import closeIcon from "assets/images/close.svg";

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
      <>
        <div className="menuTemplatesEditNameModal">
          <div className="menuTemplatesEditNameModalHeader">
            Edit name
            <button type="button" className="menuTemplatesEditNameModalCloseButton" onClick={onClose}>
              <img alt="close" src={closeIcon} />
            </button>
          </div>
          <div className="menuTemplatesEditNameModalBody">
            <div className="menuTemplatesEditNameModalLabel">
              Template name
            </div>
            <input
              className="menuTemplatesEditNameModalInput"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="menuTemplatesEditNameModalFooter">
            <button type="button" className="menuTemplatesEditNameModalCancel" onClick={onClose}>Cancel</button>
            <button type="button" className="menuTemplatesEditNameModalSave" onClick={this.submit}>Save</button>
          </div>
        </div>
        <button type="button" className="menuTemplatesEditNameOverlay" />
      </>
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
