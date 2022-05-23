import React, { useState } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";
import Switch from "react-switch";
import { formatIntegrationSettingName } from "shared/utils/common";
import {
  integrationPropType,
} from "shared/prop-types";
import {
  activeAdvisorsSelector,
  settingsDispatchCodesSelector,
} from "store/selectors/settings-selectors";
import { updateLoanerIntegrationOptions } from "store/actions/settings-actions";
import HeaderEdit from "components/common/HeaderEdit";
import Input from "components/common/Input";
import "./styles.scss";

const LoanerIntegration = ({
  integration,
  updateIntegrationHandler,
}) => {
  const {
    active,
    settings,
    id,
    kind,
  } = integration;
  const [loanerSettings, setLoanerSettings] = useState({ ...settings });
  const [isActive, setIsActive] = useState(active);
  const [isEditing, setIsEditing] = useState(false);

  const save = () => {
    const params = {
      settings: {
        ...loanerSettings,
      },
      active: isActive,
    };
    updateIntegrationHandler(id, params);
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setLoanerSettings({ ...settings });
    setIsActive(active);
    setIsEditing(false);
  };

  return (
    <section
      className="conciergeSettingsPageBlock conciergeSettingsPageIntegrationsBlock"
    >
      <section className="conciergeBlockTitle conciergeSettingsPageBlockTitle">
        <label>{kind}</label>
        <HeaderEdit
          isEditing={isEditing}
          handleCancel={cancelChanges}
          handleSave={save}
          handleEdit={() => setIsEditing(true)}
        />
      </section>
      <section className="conciergeBlockContent conciergeSettingsPageBlockContent">
        <div className="conciergeSettingsPageActivitySwitch">
          <label
            className="conciergeInputLabel"
            htmlFor="loaner-activity-switch"
          >
            Is Active
          </label>
          <Switch
            id="loaner-activity-switch"
            className="integrationActivitySwitch"
            onChange={() => setIsActive(!isActive)}
            checked={isActive}
            disabled={!isEditing}
            onColor="#36af5e"
            offColor="#dedee0"
            activeBoxShadow="0 0 2px 3px #0bcaf9"
            aria-labelledby="loaner-activity-label"
          />
        </div>
        <section className="conciergeSettingsPageIntegrationsBlockInputsPart">
          {Object.keys(settings).map((keyName) => (keyName !== "both_conditions_required") && (
            <Input
              label={formatIntegrationSettingName(keyName)}
              value={loanerSettings[keyName]}
              onChange={(value) => setLoanerSettings((prev) => ({ ...prev, [keyName]: +value }))}
              key={keyName}
              type="number"
              min={0}
              disabled={!isEditing}
            />
          ))}
          <div className="conciergeSettingsPageLoanerIntegrationSwitch">
            <label
              className="conciergeInputLabel"
              htmlFor="loaner-requirements-switch"
            >
              {formatIntegrationSettingName("both_conditions_required")}
            </label>
            <Switch
              id="loaner-requirements-switch"
              className="loanerRequirementsSwitch"
              onChange={() => setLoanerSettings((prev) => ({
                ...prev,
                both_conditions_required: !prev.both_conditions_required,
              }))}
              checked={loanerSettings.both_conditions_required}
              disabled={!isEditing}
              onColor="#36af5e"
              offColor="#dedee0"
              activeBoxShadow="0 0 2px 3px #0bcaf9"
              aria-labelledby="loaner-requirements-label"
            />
          </div>
        </section>
      </section>
    </section>
  );
};

LoanerIntegration.propTypes = {
  integration: integrationPropType.isRequired,
  updateIntegrationHandler: func.isRequired,
};

const mapStateToProps = (state) => ({
  serviceAdvisors: activeAdvisorsSelector(state),
  dispatchCodes: settingsDispatchCodesSelector(state),
});

const actions = {
  updateIntegrationHandler: updateLoanerIntegrationOptions,
};

export default connect(mapStateToProps, actions)(LoanerIntegration);
