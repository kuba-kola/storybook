import React from "react";
import { bool, object, string } from "prop-types";
import Panel from "components/common/Panel";
import SelectedServices from "./SelectedServices";
import EstimatedServiceTimeAndTotalCost from "./EstimatedServiceTimeAndTotalCost";

const AppointmentSummary = ({ services, clientWaiting, selectedTransport }) => (
  <Panel className="schedulingProcessSummaryPanelCard">
    <div className="appointmentDetailsContainer">
      <SelectedServices services={services} />
      <EstimatedServiceTimeAndTotalCost services={services} />
      <div className="bookingDetailsServiceTransportation">
        <span className="bookingDetailsServiceEstimatedTimeLabel">Transportation: </span>
        <span className="bookingDetailsServiceEstimatedTimeValue">{clientWaiting ? "Waiting room" : (selectedTransport || "No Data")}</span>
      </div>
    </div>
  </Panel>
);

AppointmentSummary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  services: object,
  clientWaiting: bool,
  selectedTransport: string,
};

AppointmentSummary.defaultProps = {
  services: null,
  clientWaiting: bool,
  selectedTransport: string,
};

export default AppointmentSummary;
