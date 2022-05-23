import React from "react";
import Input from "components/common/Input";
import Select from "react-select";
import cx from "classnames";
import "../styles.scss";

const maxHourlyAppointmentsOptions = {
  1: {
    label: "1",
    value: "1",
  },
  2: {
    label: "2",
    value: "2",
  },
  4: {
    label: "4",
    value: "4",
  },
  12: {
    label: "12",
    value: "12",
  },
};

const TeamCapacityInputs = ({
  isEditing,
  teamTag: {
    id,
    name,
    max_advisor_appointments_per_hour,
    max_advisor_appointments_per_day,
    max_pickups_per_hour,
    max_team_hours_per_weekday,
  },
  onChange,
}) => {
  const hoursPerDayValue = (value, day) => {
    if (day == "sat") {
      return { ...max_team_hours_per_weekday, sat: +value };
    }
    const assignedHours = {
      mon: +value,
      tue: +value,
      wed: +value,
      thu: +value,
      fri: +value,
    };
    return { ...max_team_hours_per_weekday, ...assignedHours };
  };

  const parsedValue = (value) => (value.match(/^\d+$/) ? +value : 0);

  return (
    <>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        {name}
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent"><span>Mon--Fri</span></div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        <Input
          inputClassName="conciergeSettingsCapacityGridItemInput"
          value={max_team_hours_per_weekday.mon}
          disabled={!isEditing}
          onChange={(value) => onChange(id, "max_team_hours_per_weekday", hoursPerDayValue(value, "mon"))}
        />
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        <div className="conciergeSettingsCapacityGridItemSelectWrapper">
          <Select
            className="conciergeSettingsCapacityGridItemSelect"
            options={Object.values(maxHourlyAppointmentsOptions)}
            value={maxHourlyAppointmentsOptions.max_advisor_appointments_per_hour}
            isDisabled={!isEditing}
            onChange={(value) => onChange(id, "max_advisor_appointments_per_hour", parsedValue(value.value))}
            placeholder={max_advisor_appointments_per_hour}
          />
        </div>
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        <Input
          inputClassName={cx(
            "conciergeSettingsCapacityGridItemInput",
            { conciergeSettingsCapacityGridItemInputInvalid: max_advisor_appointments_per_day == "0" },
          )}
          value={max_advisor_appointments_per_day}
          disabled={!isEditing}
          onChange={(value) => onChange(id, "max_advisor_appointments_per_day", parsedValue(value))}
        />
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        <Input
          inputClassName={cx(
            "conciergeSettingsCapacityGridItemInput",
            { conciergeSettingsCapacityGridItemInputInvalid: max_pickups_per_hour == "0" },
          )}
          value={max_pickups_per_hour}
          disabled={!isEditing}
          onChange={(value) => onChange(id, "max_pickups_per_hour", value)}
        />
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent" />
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent"><span>Sat</span></div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent">
        <Input
          inputClassName="conciergeSettingsCapacityGridItemInput"
          value={max_team_hours_per_weekday.sat}
          disabled={!isEditing}
          onChange={(value) => onChange(id, "max_team_hours_per_weekday", hoursPerDayValue(value, "sat"))}
        />
      </div>
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent" />
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent" />
      <div className="conciergeSettingsCapacityGridItem conciergeSettingsCapacityGridItemTableContent" />
    </>
  );
};

export default TeamCapacityInputs;
