import React, { Component } from "react";
import {
  func, number, string, arrayOf, shape,
} from "prop-types";
import { connect } from "react-redux";

import Input from "components/common/Input";
import { updateTvScreen } from "store/actions/settings-actions";
import { settingsTvScreensSelector } from "store/selectors/settings-selectors";
import closeIcon from "assets/images/close.svg";

class EditTvScreenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
  }

  componentDidMount() {
    const { tvScreens, id } = this.props;
    const currentTvScreen = tvScreens.find((tvScreen) => tvScreen.id === id);
    if (currentTvScreen) {
      this.setState({
        username: currentTvScreen.username,
        password: currentTvScreen.password,
      });
    }
  }

  submit = () => {
    const { password, username } = this.state;
    if (this.validate()) {
      this.props.changeTvScreen(this.props.id, { password, username })
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
            Edit TV screen
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
EditTvScreenModal.propTypes = {
  changeTvScreen: func,
  onClose: func.isRequired,
  id: number.isRequired,
  tvScreens: arrayOf(shape({
    username: string.isRequired,
    password: string.isRequired,
  })),
};

EditTvScreenModal.defaultProps = {
  changeTvScreen: null,
  tvScreens: [],
};

const mapStateToProps = (state) => ({
  tvScreens: settingsTvScreensSelector(state),
});

const actions = {
  changeTvScreen: updateTvScreen,
};

export default connect(mapStateToProps, actions)(EditTvScreenModal);
