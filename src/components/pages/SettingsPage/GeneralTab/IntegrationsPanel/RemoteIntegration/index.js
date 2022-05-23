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
import { updateRemoteIntegrationOptions } from "store/actions/settings-actions";
import HeaderEdit from "components/common/HeaderEdit";
import Input from "components/common/Input";
import "./styles.scss";

const RemoteIntegration = ({
  integration,
  updateIntegrationHandler,
}) => {
  const {
    active,
    settings,
    id,
    kind,
  } = integration;
  const [remoteSettings, setRemoteSettings] = useState({ ...settings });
  const [isActive, setIsActive] = useState(active);
  const [isEditing, setIsEditing] = useState(false);

  const save = () => {
    const params = {
      settings: {
        ...remoteSettings,
      },
      active: isActive,
    };
    updateIntegrationHandler(id, params);
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setRemoteSettings({ ...settings });
    setIsActive(active);
    setIsEditing(false);
  };

  const setMaxDistance = (value) => {
    const maxDistance = value !== "" && value < 1 ? 1 : value;
    setRemoteSettings({ ...remoteSettings, max_distance: maxDistance });
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
            htmlFor="remote-activity-switch"
          >
            Is Active
          </label>
          <Switch
            id="remote-activity-switch"
            className="integrationActivitySwitch"
            onChange={() => setIsActive(!isActive)}
            checked={isActive}
            disabled={!isEditing}
            onColor="#36af5e"
            offColor="#dedee0"
            activeBoxShadow="0 0 2px 3px #0bcaf9"
            aria-labelledby="remote-activity-label"
          />
        </div>
        <section className="conciergeSettingsPageIntegrationsBlockInputsPart">
          {Object.keys(settings).map((keyName) => (keyName !== "both_conditions_required" && keyName !== "max_distance") && (
            <Input
              label={formatIntegrationSettingName(keyName)}
              value={remoteSettings[keyName]}
              onChange={(value) => setRemoteSettings((prev) => ({ ...prev, [keyName]: +value }))}
              key={keyName}
              type="number"
              min={0}
              disabled={!isEditing}
            />
          ))}
          <Input
            label={formatIntegrationSettingName("max_distance")}
            value={remoteSettings.max_distance}
            onChange={setMaxDistance}
            key="max_distance"
            type="number"
            disabled={!isEditing}
          />
          <div className="conciergeSettingsPageRemoteIntegrationSwitch">
            <label
              className="conciergeInputLabel"
              htmlFor="remote-requirements-switch"
            >
              {formatIntegrationSettingName("both_conditions_required")}
            </label>
            <Switch
              id="remote-requirements-switch"
              className="remoteRequirementsSwitch"
              onChange={() => setRemoteSettings((prev) => ({
                ...prev,
                both_conditions_required: !prev.both_conditions_required,
              }))}
              checked={remoteSettings.both_conditions_required}
              disabled={!isEditing}
              onColor="#36af5e"
              offColor="#dedee0"
              activeBoxShadow="0 0 2px 3px #0bcaf9"
              aria-labelledby="remote-requirements-label"
            />
          </div>
        </section>
      </section>
    </section>
  );
};

RemoteIntegration.propTypes = {
  integration: integrationPropType.isRequired,
  updateIntegrationHandler: func.isRequired,
};

const mapStateToProps = (state) => ({
  serviceAdvisors: activeAdvisorsSelector(state),
  dispatchCodes: settingsDispatchCodesSelector(state),
});

const actions = {
  updateIntegrationHandler: updateRemoteIntegrationOptions,
};

export default connect(mapStateToProps, actions)(RemoteIntegration);
