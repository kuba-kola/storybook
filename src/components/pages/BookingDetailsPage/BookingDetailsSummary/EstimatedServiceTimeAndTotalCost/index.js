import React from "react";
import PropTypes from "prop-types";
import "../styles.scss";

import { totalCostForBooking, estimatedServiceTimeForBooking } from "shared/utils/common";

const EstimatedServiceTimeAndTotalCost = ({ booking }) => {
  const { menu_items, service_advisor } = booking;

  return (
    <>
      <div className="bookingDetailsSectionTitle">
        Total
      </div>
      <div className="bookingDetailsSectionContent">
        {menu_items && `$${totalCostForBooking(menu_items)}`}
      </div>
      <div className="bookingDetailsSectionItem">
        <div>
          <span className="bookingDetailsSectionItemLabel">Estimated service time: </span>
          <span className="bookingDetailsSectionItemValue">{`${estimatedServiceTimeForBooking(menu_items)} hours`}</span>
        </div>
        { service_advisor
          && (
          <div>
            <span className="bookingDetailsSectionItemLabel">Service advisor: </span>
            <span className="bookingDetailsSectionItemValue">{`${service_advisor.name}`}</span>
          </div>
          )}
      </div>
    </>
  );
};

EstimatedServiceTimeAndTotalCost.propTypes = {
  booking: PropTypes.shape({
    menu_items: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default EstimatedServiceTimeAndTotalCost;
