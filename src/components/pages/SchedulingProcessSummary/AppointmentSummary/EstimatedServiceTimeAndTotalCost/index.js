import React from "react";
import { object } from "prop-types";
import "../styles.scss";

import { totalCost, estimatedServiceTimeForBooking } from "shared/utils/common";

const EstimatedServiceTimeAndTotalCost = ({ services }) => (
  <>
    <div className="bookingDetailsServiceTotal">
      Total
    </div>
    <div className="bookingDetailsServiceTotalValue">
      {services && `$${totalCost(services)}`}
    </div>
    <div className="bookingDetailsServiceEstimatedTime">
      <span className="bookingDetailsServiceEstimatedTimeLabel">Estimated services time: </span>
      <span className="bookingDetailsServiceEstimatedTimeValue">{`${estimatedServiceTimeForBooking(services)} hours`}</span>
    </div>
  </>
);

EstimatedServiceTimeAndTotalCost.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  services: object,
};

EstimatedServiceTimeAndTotalCost.defaultProps = {
  services: null,
};

export default EstimatedServiceTimeAndTotalCost;
