import React from "react";
import { object } from "prop-types";
import Panel from "components/common/Panel";

import SelectedServices from "./SelectedServices";
import TeamAllocation from "./TeamAllocation";
import EstimatedServiceTimeAndTotalCost from "./EstimatedServiceTimeAndTotalCost";

const BookingDetailsSummary = ({ booking }) => (
  <Panel className="conciergeBookingDetailsPanelCard">
    <div className="appointmentDetailsContainer">
      <SelectedServices booking={booking} />
      <EstimatedServiceTimeAndTotalCost booking={booking} />
      <TeamAllocation booking={booking} />
    </div>
  </Panel>
);

BookingDetailsSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
};

BookingDetailsSummary.defaultProps = {
  booking: null,
};

export default BookingDetailsSummary;
