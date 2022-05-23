import React, { useState } from "react";
import { connect } from "react-redux";
import { identity } from "ramda";
import {
  number, string, objectOf, oneOfType, bool, func,
} from "prop-types";
import Switch from "react-switch";
import { formatIntegrationSettingName } from "shared/utils/common";
import { updateIntegrationOptions } from "store/actions/settings-actions";
import Input from "components/common/Input";
import HeaderEdit from "components/common/HeaderEdit";

const Integration = ({
  kind,
  id,
  settings,
  active,
  updateIntegrationHandler,
  isSuperAdmin,
}) => {
  const [isActive, setIsActive] = useState(active);
  const [isEditing, setIsEditing] = useState(false);
  const [integrationSettings, setIntegrationSettings] = useState(settings);

  const save = () => {
    const params = {
      settings: integrationSettings,
      active: isActive,
    };
    updateIntegrationHandler(id, params);
    setIsEditing(false);
  };

  const cancelChanges = () => {
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
            htmlFor="integration-activity-switch"
          >
            Is Active
          </label>
          <Switch
            id="integration-activity-switch"
            className="integrationActivitySwitch"
            onChange={() => setIsActive(!isActive)}
            checked={isActive}
            disabled={!isEditing}
            onColor="#36af5e"
            offColor="#dedee0"
            activeBoxShadow="0 0 2px 3px #0bcaf9"
            aria-labelledby="integration-activity-label"
          />
        </div>
        <section className="conciergeSettingsPageIntegrationsBlockInputsPart">
          {Object.keys(integrationSettings).map((keyName) => (
            <Input
              label={formatIntegrationSettingName(keyName)}
              value={integrationSettings[keyName]}
              disabled={!isSuperAdmin || !isEditing}
              onChange={(value) => setIntegrationSettings({ ...integrationSettings, [keyName]: value })}
              key={keyName}
            />
          ))}
        </section>
      </section>
    </section>
  );
};

Integration.propTypes = {
  id: number.isRequired,
  kind: string.isRequired,
  settings: objectOf(oneOfType([number, string])),
  active: bool.isRequired,
  updateIntegrationHandler: func.isRequired,
};

Integration.defaultProps = {
  settings: {},
};

const actions = {
  updateIntegrationHandler: updateIntegrationOptions,
};

export default connect(null, actions)(Integration);
