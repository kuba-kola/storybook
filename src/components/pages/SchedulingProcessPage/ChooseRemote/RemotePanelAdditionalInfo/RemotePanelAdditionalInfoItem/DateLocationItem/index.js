import React from "react";
import { bool, func, shape } from "prop-types";
import { remoteAdditionalInfoJobPropType } from "components/common/Remote/propTypes";

import LocationInput from "components/common/Remote/LocationInput";

const DateLocationItem = ({
  isPickUp,
  isDropOff,
  additionalInfo,
  onChange,
}) => (
  <div className="row">
    <LocationInput
      isPickUp={isPickUp}
      isDropOff={isDropOff}
      additionalInfo={additionalInfo}
      onChange={onChange}
      isScheduler
    />
  </div>
);

DateLocationItem.propTypes = {
  additionalInfo: shape({
    pickUp: remoteAdditionalInfoJobPropType,
  }),
  isPickUp: bool,
  isDropOff: bool,
  onChange: func.isRequired,
};

DateLocationItem.defaultProps = {
  additionalInfo: {},
  isPickUp: false,
  isDropOff: false,
};

export default DateLocationItem;
