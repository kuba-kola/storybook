import React from "react";

import { bool, object, string } from "prop-types";

import appraisalIcon from "assets/images/bookings/label.svg";
import RecallIcon from "assets/images/bookings/recallIcon.svg";
import customerWaitingIcon from "assets/images/bookings/coffee.svg";
import concernIcon from "assets/images/bookings/car.svg";
import emptyIcon from "assets/images/bookings/status/empty.svg";
import checkedInIcon from "assets/images/bookings/status/checked-in.svg";
import arrivedIcon from "assets/images/bookings/status/arrived.svg";
import jobConfirmedIcon from "assets/images/bookings/driverActivity/done.svg";
import driverAssignedIcon from "assets/images/bookings/driverActivity/driverAssigned.svg";
import enRouteToCustomerIcon from "assets/images/bookings/driverActivity/enRouteToCustomer.svg";
import arrivedToLocationIcon from "assets/images/bookings/driverActivity/arrivedToLocation.svg";
import enRouteToDealershipIcon from "assets/images/bookings/driverActivity/enRouteToDealership.svg";
import arrivedToDealershipIcon from "assets/images/bookings/driverActivity/arrivedToDealership.svg";
import lyftIcon from "assets/images/bookings/alternativeTransport/lyft.png";
import loanerIcon from "assets/images/bookings/alternativeTransport/loaner.svg";
import uberIcon from "assets/images/bookings/alternativeTransport/uber.png";
import shuttleIcon from "assets/images/bookings/alternativeTransport/shuttle1.png";

import "./styles.scss";

const jobStateIcons = {
  created: jobConfirmedIcon,
  driver_assigned: driverAssignedIcon,
  en_route_to_customer: enRouteToCustomerIcon,
  arrived_to_customer: arrivedToLocationIcon,
  en_route_to_dealership: enRouteToDealershipIcon,
  arrived_to_dealership: arrivedToDealershipIcon,
};

const appointmentStatusIcons = {
  not_checked_in: emptyIcon,
  checked_in: checkedInIcon,
  arrived: arrivedIcon,
};

const alternativeTransportOptionIcons = {
  loaner: loanerIcon,
  lyft: lyftIcon,
  uber: uberIcon,
  shuttle: shuttleIcon,
};

const BookingAdditionalInfoCell = ({
  jobState,
  status,
  customerWaiting,
  withConcern,
  withRecall,
  appraisalRequested,
  alternativeTransport,
}) => (
  <div className="conciergeBookingsAdditionalInfoCellContainer">
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {(jobState && jobStateIcons[jobState]) && <img src={jobStateIcons[jobState]} alt="jobState" />}
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      <img src={appointmentStatusIcons[status]} alt="bookingState" />
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {customerWaiting && <img src={customerWaitingIcon} alt="customer waiting" />}
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {
        (alternativeTransport
          && alternativeTransport.kind
          && alternativeTransportOptionIcons[alternativeTransport.kind])
          && (
            <img
              src={alternativeTransportOptionIcons[alternativeTransport.kind]}
              className="conciergeBookingsAdditionalInfoCellAlternativeTransport"
              alt={alternativeTransport.kind}
            />
          )
      }
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {withConcern && <img src={concernIcon} alt="with concern" />}
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {appraisalRequested && <img src={appraisalIcon} alt="appraisal requested" />}
    </div>
    <div className="conciergeBookingsAdditionalInfoCellStatusCell">
      {withRecall && <img src={RecallIcon} alt="jobState" />}
    </div>
  </div>
);

BookingAdditionalInfoCell.propTypes = {
  jobState: bool,
  status: string.isRequired,
  customerWaiting: bool.isRequired,
  withConcern: bool.isRequired,
  withRecall: bool.isRequired,
  appraisalRequested: bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  alternativeTransport: object,
};

BookingAdditionalInfoCell.defaultProps = {
  jobState: null,
  alternativeTransport: null,
};

export default BookingAdditionalInfoCell;
