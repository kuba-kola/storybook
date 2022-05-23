import React, { Component } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import Input from "components/common/Input";
import { updateKiosk } from "store/actions/settings-actions";
import { settingsKiosksSelector } from "store/selectors/settings-selectors";
import closeIcon from "assets/images/close.svg";

class EditKioskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
  }

  componentDidMount() {
    const { kiosks, id } = this.props;
    const currentKiosk = kiosks.find((kiosk) => kiosk.id === id);
    if (currentKiosk) {
      this.setState({
        username: currentKiosk.username,
        password: currentKiosk.password,
      });
    }
  }

  submit = () => {
    const { password, username } = this.state;
    if (this.validate()) {
      this.props.changeKiosk(this.props.id, { password, username })
        .then(() => this.props.onClose())
        .catch(({ response: { data } }) => this.setState({
          errors: {
            password: data.password,
            username: data.username,
          },
        }));
    }
  }

  validate = () => {
    const { username, password } = this.state;
    const errors = {
      password: !password && "Password must be present.",
      username: !username && "Username must be present.",
    };
    this.setState({ errors });
    return !Object.values(errors).find((v) => v);
  }

  handleInputChange = (fieldName, value) => this.setState({ [fieldName]: value })

  render() {
    const { errors } = this.state;

    return (
      <>
        <div className="menuTemplatesAddTemplateModal conciergeSettingsAddUserModal">
          <div className="menuTemplatesAddTemplateModalHeader">
            Edit kiosk
            <button
              type="button"
              className="menuTemplatesAddTemplateModalCloseButton"
              onClick={this.props.onClose}
            >
              <img alt="close" src={closeIcon} />
            </button>
          </div>
          <div className="menuTemplatesAddTemplateModalBody">
            <Input
              label="User name"
              value={this.state.username}
              error={errors.username}
              onChange={(value) => this.handleInputChange("username", value)}
            />
            <Input
              label="Password"
              value={this.state.password}
              error={errors.password}
              onChange={(value) => this.handleInputChange("password", value)}
            />
          </div>
          <div className="menuTemplatesAddTemplateModalFooter conciergeSettingsAddUserModalFooter">
            <button
              type="button"
              className="menuTemplatesAddTemplateModalCancel"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="menuTemplatesAddTemplateModalSave"
              onClick={this.submit}
            >
              Save
            </button>
          </div>
        </div>
        <button type="button" className="menuTemplatesAddTemplateOverlay" />
      </>
    );
  }
}
EditKioskModal.propTypes = {
  changeKiosk: func,
  onClose: func.isRequired,
  id: number.isRequired,
  kiosks: arrayOf(shape({
    username: string.isRequired,
    password: string.isRequired,
  })),
};

EditKioskModal.defaultProps = {
  changeKiosk: null,
  kiosks: [],
};

const mapStateToProps = (state) => ({
  kiosks: settingsKiosksSelector(state),
});

const actions = {
  changeKiosk: updateKiosk,
};

export default connect(mapStateToProps, actions)(EditKioskModal);
