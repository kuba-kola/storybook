import React from "react";
import { array, bool, string } from "prop-types";

import Dropdown from "components/common/Dropdown";

import "./styles.scss";

const AlternativeTransportationColumn = ({
  placeholder, options, label, readOnly,
}) => (
  <div className="conciergeDropdownBlockContainerColumn">
    <p className="conciergeBookingDetailsLabel">{label}</p>
    <Dropdown
      options={options}
      placeholder={placeholder}
      readOnly
    />
  </div>
);

AlternativeTransportationColumn.propTypes = {
  placeholder: string,
  // eslint-disable-next-line react/forbid-prop-types
  options: array,
  label: string,
  readOnly: bool,
};

AlternativeTransportationColumn.defaultProps = {
  placeholder: null,
  label: null,
  options: [],
  readOnly: true,
};

export default AlternativeTransportationColumn;
