import React from "react";
import PropTypes from "prop-types";
import dateFns from "date-fns";
import { AMERICAN_DATE_FORMAT } from "shared/utils/datetime";
import "../styles.scss";

const TeamAllocation = ({ booking }) => {
  const { teams_time_allocations } = booking;
  if (!teams_time_allocations || !teams_time_allocations.length) return null;

  return (
    <>
      <div className="bookingDetailsSectionTitle">Team Allocation</div>
      <div className="bookingDetailsSectionBody">
        {teams_time_allocations.map(({ actual_plus_time, day, team_tag }) => (
          <div className="bookingDetailsSectionItem">
            <span className="bookingDetailsSectionItemKey">
              {team_tag.name}
              {" "}
              :
              {" "}
            </span>
            <span className="bookingDetailsSectionItemValue">
              {dateFns.format(day, AMERICAN_DATE_FORMAT)}
              {" "}
              <br />
              {+actual_plus_time}
              {" "}
              hours
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

TeamAllocation.propTypes = {
  booking: PropTypes.shape({
    teams_time_allocations: PropTypes.object.isRequired,
  }).isRequired,
};

export default TeamAllocation;
