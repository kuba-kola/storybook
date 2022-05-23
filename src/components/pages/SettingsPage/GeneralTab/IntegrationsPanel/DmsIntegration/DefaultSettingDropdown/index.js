import React, { useMemo } from "react";
import {
  func,
  arrayOf,
  oneOfType,
  string,
  bool,
} from "prop-types";
import { serviceAdvisorPropType, dispatchCodePropType } from "shared/prop-types";

import Dropdown from "components/common/Dropdown";

const defaultOption = { label: "", value: "" };

const DefaultSettingDropdown = ({
  collection,
  idColumn,
  nameColumn,
  dropdownLabel,
  dropdownKey,
  selectedValue,
  updateHandler,
  isDisabled,
}) => {
  const fetchedOptions = useMemo(() => (
    (collection || []).map((element) => (
      {
        label: `${element[idColumn]} - ${element[nameColumn]}`,
        value: element[idColumn],
      }
    ))
  ), [collection]);
  const selectedOption = fetchedOptions.find((option) => (
    option.value === selectedValue
  ));
  const dropdownOptions = selectedOption
    ? fetchedOptions : [defaultOption, ...fetchedOptions];

  return (
    <div className="conciergeSettingsPageIntegrationsBlockDefaultOptionDropdownContainer">
      <div className="conciergeInputLabel">{dropdownLabel}</div>
      <Dropdown
        key={dropdownKey}
        options={dropdownOptions}
        defaultSelected={selectedOption || defaultOption}
        onSelect={updateHandler}
        readOnly={isDisabled}
      />
    </div>
  );
};

DefaultSettingDropdown.propTypes = {
  collection: arrayOf(oneOfType([serviceAdvisorPropType, dispatchCodePropType])),
  idColumn: string.isRequired,
  nameColumn: string.isRequired,
  dropdownLabel: string.isRequired,
  dropdownKey: string.isRequired,
  selectedValue: string,
  updateHandler: func.isRequired,
  isDisabled: bool.isRequired,
};

DefaultSettingDropdown.defaultProps = {
  collection: [],
  selectedValue: null,
};

export default DefaultSettingDropdown;
