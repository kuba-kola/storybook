import React, { Component } from "react";
import {
  func, arrayOf, string, number,
} from "prop-types";
import {
  isNil, isEmpty, identity, reject,
} from "ramda";
import { connect } from "react-redux";
import Switch from "react-switch";
import { integrationSettingsKeys } from "shared/constants";
import { addIntegration } from "store/actions/dealership-details-actions";
import { formatIntegrationSettingName } from "shared/utils/common";
import StyledSelect from "components/common/StyledSelect";
import Input from "components/common/Input";
import Modal from "components/common/Modal";

import "./styles.scss";

class AddIntegrationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealershipId: null,
      integrationType: null,
      settings: {},
      errors: {},
    };
  }

  componentDidMount() {
    this.setState({ dealershipId: this.props.dealershipId });
  }

  settingBlankError = (fieldValue, fieldName) => (
    isNil(fieldValue) ? `${formatIntegrationSettingName(fieldName)} can't be blank.` : null
  );

  validate = () => {
    const { integrationType, errors } = this.state;
    if (isNil(integrationType) || isEmpty(integrationType)) {
      this.setState({ errors: { ...errors, integrationType: "Integration type can't be blank" } });
      return false;
    }
    /* eslint-disable no-return-assign */
    integrationSettingsKeys[integrationType].every((integrationKey) => (
      errors[integrationType] = {
        ...errors[integrationType],
        [integrationKey]: this.settingBlankError(
          this.state.settings[integrationKey],
          integrationKey,
        ),
      }
    ));
    /* eslint-enable */
    this.setState({ errors });
    return isEmpty(reject(isNil, Object.values(errors[integrationType])));
  }

  updateIntegrationType = (newIntegrationType) => {
    if (this.state.integrationType !== newIntegrationType.value) {
      this.setState({ integrationType: newIntegrationType.value, settings: {}, errors: {} });
    }
  }

  handleSettingsChange = (settingValue, settingsKey) => {
    const { settings, integrationType, errors } = this.state;
    this.setState({
      settings: { ...settings, [settingsKey]: settingValue },
      errors: { ...errors, [integrationType]: { ...errors[integrationType], [settingsKey]: null } },
    });
  }

  submit = () => {
    if (this.validate()) {
      const integrationParams = {
        kind: this.state.integrationType,
        settings: this.state.settings,
      };
      this.props.onSubmit(this.state.dealershipId, integrationParams);
      this.props.onClose();
    }
  }

  prepareIntegrationTypesOptions = () => (
    Object.keys(integrationSettingsKeys)
      .map((keyName) => (
        {
          label: formatIntegrationSettingName(keyName),
          value: keyName,
          selectable: integrationSettingsKeys[keyName].length > 0,
        }
      ))
      .filter((el) => !this.props.excludedIntegrations.includes(el.value))
  )

  prepareSettingsKeys = () => (
    isNil(this.state.integrationType) || isEmpty(this.state.integrationType)
      ? [] : integrationSettingsKeys[this.state.integrationType]
  )

  prepareIntegrationsDropdown = (errors) => {
    const integrationTypesOptions = this.prepareIntegrationTypesOptions();
    const emptyOption = { label: "", value: "", selectable: true };
    if (!isEmpty(integrationTypesOptions)) {
      const integrationOptions = [emptyOption, ...integrationTypesOptions];
      const selectedOption = integrationOptions.find((integrationTypeOption) => (
        integrationTypeOption.value === this.state.integrationType
      )) || emptyOption;
      return (
        <StyledSelect
          className="conciergeDealershipDetailsAddIntegrationModalSelect"
          key="integration_type"
          options={integrationOptions}
          value={selectedOption}
          onChange={this.updateIntegrationType}
          error={errors.integrationType}
          isOptionDisabled={(option) => option.selectable === false}
        />
      );
    }
    return (
      <StyledSelect
        className="conciergeDealershipDetailsAddIntegrationModalSelect"
        key="integration_type"
        options={[emptyOption]}
        value={emptyOption}
        onChange={identity}
        error={errors.integrationType}
      />
    );
  }

  render() {
    const settingsKeys = this.prepareSettingsKeys();
    const { settings, integrationType, errors } = this.state;
    const integrationsDropdown = this.prepareIntegrationsDropdown(errors);

    return (
      <Modal
        title="New integration"
        cancelButtonText="Cancel"
        submitButtonText="Create"
        size="medium"
        onCancel={this.props.onClose}
        onSubmit={this.submit}
      >
        <div className="addIntegrationModalDropdownContainer">
          <div className="addIntegrationModalSelectWrapper">
            <div className="conciergeInputLabel">Integration type</div>
            {integrationsDropdown}
          </div>
        </div>
        <div className="addIntegrationModalInputsContainer">
          {settingsKeys.map((keyName) => {
            const { [integrationType]: { [keyName]: keyNameError } = {} } = errors;
            if (keyName === "both_conditions_required") {
              return (
                <div
                  key={keyName}
                  className="conciergeSettingsPageRemoteIntegrationSwitch"
                >
                  <label
                    className="conciergeInputLabel"
                    htmlFor="remote-requirements-switch"
                  >
                    {formatIntegrationSettingName("both_conditions_required")}
                  </label>
                  <Switch
                    id="remote-requirements-switch"
                    className="remoteRequirementsSwitch"
                    onChange={() => this.handleSettingsChange(!settings[keyName], keyName)}
                    checked={settings[keyName]}
                    onColor="#36af5e"
                    offColor="#dedee0"
                    activeBoxShadow="0 0 2px 3px #0bcaf9"
                    aria-labelledby="remote-requirements-label"
                  />
                </div>
              );
            }
            return (
              <div className="addIntegrationModalInputContainer" key={keyName}>
                <Input
                  label={formatIntegrationSettingName(keyName)}
                  key={keyName}
                  className="addIntegrationModalInput"
                  value={settings[keyName] || ""}
                  onChange={(value) => this.handleSettingsChange(value, keyName)}
                  error={keyNameError}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }
}

AddIntegrationModal.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  dealershipId: number,
  excludedIntegrations: arrayOf(string),
};

AddIntegrationModal.defaultProps = {
  dealershipId: null,
  excludedIntegrations: [],
};

const actions = {
  onSubmit: addIntegration,
};

export default connect(null, actions)(AddIntegrationModal);
