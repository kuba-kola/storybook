import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { settingsCapacityTimeBufferSelector, settingsTeamTagsLoadingStateSelector, settingsTeamTagsSelector } from "store/selectors/settings-selectors";
import { updateCapacitySettings, updateTeamCapacity } from "store/actions/settings-actions";
import { makeHashFromArray } from "shared/utils";
import HeaderEdit from "components/common/HeaderEdit";
import Panel from "components/common/Panel";
import ReactTooltip from "react-tooltip";
import tooltipIcon from "assets/images/tooltip.svg";
import Input from "components/common/Input";
import TeamCapacityInputs from "./TeamCapacityInputs";
import "./styles.scss";

const DailyTeamCapacity = ({
  teamTags,
  capacityTimeBuffer,
  onUpdateTeamsCapacity,
  onUpdateDealershipCapacitySettings,
}) => {
  const [teamTagsHash, setTeamTagsHash] = useState(makeHashFromArray(teamTags));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [capacityBuffer, setCapacityBuffer] = useState(capacityTimeBuffer);

  useEffect(() => {
    setCapacityBuffer(capacityTimeBuffer);
  }, [capacityTimeBuffer]);

  const saveChanges = () => {
    setIsEditing(false);
    onUpdateTeamsCapacity(teamTagsHash);
    onUpdateDealershipCapacitySettings({ capacity_time_buffer: capacityBuffer });
  };

  const cancelChanges = () => {
    setTeamTagsHash(makeHashFromArray(teamTags));
    setCapacityBuffer(capacityTimeBuffer);
  };

  const handleChange = (teamTagId, setting, value) => {
    if ((value == "0" || value == "")) {
      setTeamCapacity(teamTagId, setting, value);
      return setIsSaveDisabled(true);
    }

    setIsSaveDisabled(false);
    setTeamCapacity(teamTagId, setting, value);
  };

  const setTeamCapacity = (teamTagId, setting, value) => {
    setTeamTagsHash((prevTeamTags) => ({
      ...prevTeamTags,
      [teamTagId]: {
        ...prevTeamTags[teamTagId],
        [setting]: value,
      },
    }));
  };

  return (
    <Panel
      header={(
        <>
          <div className="display-flex space-between align-items-center full-width">
            <p className="conciergeBookingDetailsPanelHeader">Daily capacity</p>
            <HeaderEdit
              isEditing={isEditing}
              handleEdit={() => setIsEditing(true)}
              handleCancel={cancelChanges}
              handleSave={saveChanges}
              isSaveDisabled={isSaveDisabled}
            />
          </div>
        </>
      )}
      className="conciergeSettingsPageCapacityTabCapacityPanel"
    >
      <div className="conciergeSettingsCapacityGrid">
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader">
          <div className="conciergeSettingsCapacityGridCaption">Team Tags</div>
        </div>
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader" />
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader">
          <div
            data-for="capacity-tooltip"
            data-tip="Based on actual plus upsell"
            data-event="click focus"
            className="conciergeSettingsCapacityGridCaption"
          >
            Max team hours
            <img className="conciergeSettingsCapacityGridCaptionIcon" src={tooltipIcon} alt="" />
          </div>
          <div className="conciergeSettingsCapacityGridCaptionSubtitle">
            /per day
          </div>
        </div>
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader">
          <div
            data-for="capacity-tooltip"
            data-tip={`
            If an advisor is only working part-time on a particular day, their capacity for that day is a proportional fraction of their "regular" capacity
            `}
            data-event="click focus"
            className="conciergeSettingsCapacityGridCaption"
          >
            Max hourly appointments
            <img className="conciergeSettingsCapacityGridCaptionIcon" src={tooltipIcon} alt="" />
          </div>
          <div className="conciergeSettingsCapacityGridCaptionSubtitle">
            /per advisor
          </div>
        </div>
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader">
          <div
            className="conciergeSettingsCapacityGridCaption"
          >
            Max daily appointments
          </div>
          <div className="conciergeSettingsCapacityGridCaptionSubtitle">
            /per advisor
          </div>
        </div>
        <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableHeader">
          <div
            className="conciergeSettingsCapacityGridCaption"
          >
            Max pick-ups
          </div>
          <div className="conciergeSettingsCapacityGridCaptionSubtitle">
            /per hour
          </div>
        </div>
        {Object.values(teamTagsHash).map((teamTag) => (
          <TeamCapacityInputs
            isEditing={isEditing}
            key={teamTag.id}
            teamTag={teamTag}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="conciergeSettingsCapacityDivider">&nbsp;</div>
      <Input
        inputClassName="conciergeSettingsCapacityBufferInput"
        label="Capacity time buffer"
        type="number"
        step="0.1"
        min="0"
        max="20"
        disabled={!isEditing}
        value={capacityBuffer}
        onChange={(value) => value >= 0 && value <= 20 && setCapacityBuffer(value)}
      />

      <ReactTooltip
        id="capacity-tooltip"
        className="conciergeSettingsCapacityTooltip"
        place="bottom"
        backgroundColor="#F9FAFC"
        textColor="black"
        border
        borderColor="#dedee0"
        globalEventOff="click"
        getContent={(dataTip) => (
          <>
            <span>Note:</span>
            {" "}
            {dataTip}
          </>
        )}
      />
    </Panel>
  );
};

const mapStateToProps = (state) => ({
  isTeamTagsLoading: settingsTeamTagsLoadingStateSelector(state),
  teamTags: settingsTeamTagsSelector(state),
  capacityTimeBuffer: settingsCapacityTimeBufferSelector(state),

});

const actions = {
  onUpdateTeamsCapacity: updateTeamCapacity,
  onUpdateDealershipCapacitySettings: updateCapacitySettings,
};

export default connect(mapStateToProps, actions)(DailyTeamCapacity);
