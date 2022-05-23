import React, { useState, useEffect } from "react";
import cx from "classnames";
import { bool, number } from "prop-types";

import { workingHoursPropType } from "shared/prop-types";
import { timeInUSFormat } from "shared/utils/datetime";

import "./styles.scss";

const WEEKDAYS = [
  { label: "M", value: "mon" },
  { label: "T", value: "tue" },
  { label: "W", value: "wed" },
  { label: "T", value: "thu" },
  { label: "F", value: "fri" },
  { label: "S", value: "sat" },
  { label: "S", value: "sun" },
];

const AdvisorsWorkingHoursCell = ({
  value: advisorWorkingHours,
  isActive,
  advisorId,
}) => {
  const [workingHoursText, setWorkingHoursText] = useState(null);

  const updateWorkingHoursText = (selectedDay) => {
    const matchingDay = advisorWorkingHours[selectedDay];
    if (matchingDay !== undefined && matchingDay.from !== undefined) {
      setWorkingHoursText(`${timeInUSFormat(matchingDay.from)} - ${timeInUSFormat(matchingDay.to)}`);
    } else {
      setWorkingHoursText("No working hours");
    }
  };

  const clearWorkingHoursText = () => setWorkingHoursText(null);

  return (
    <div className="conciergeTableAdvisorsWorkingHoursCell">
      {!isActive && (
        <p className="conciergeTableAdvisorsWorkingHours__inactiveAdvisorInfo">
          Not reservable by customers
        </p>
      )}
      {isActive && (
        <>
          <div className="conciergeTableAdvisorsWorkingHours__daysContainer">
            {WEEKDAYS.map((weekday) => (
              <span
                key={`${advisorId}-${weekday.value}`}
                className={cx(
                  "conciergeTableAdvisorsWorkingHours__dayValue",
                  {
                    "conciergeTableAdvisorsWorkingHours__dayValue--active":
                      advisorWorkingHours && advisorWorkingHours[weekday.value] !== undefined
                      && advisorWorkingHours[weekday.value].from !== undefined
                    ,
                  },
                )}
                onMouseEnter={() => updateWorkingHoursText(weekday.value)}
                onMouseLeave={() => clearWorkingHoursText()}
              >
                {weekday.label}
              </span>
            ))}
          </div>
          <div className="conciergeTableAdvisorsWorkingHours__hoursContainer">
            <div className="conciergeTableAdvisorsWorkingHours__hoursLabel">
              Hours:
            </div>
            <div className="conciergeTableAdvisorsWorkingHours__hoursValue">
              {workingHoursText}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

AdvisorsWorkingHoursCell.propTypes = {
  value: workingHoursPropType,
  isActive: bool.isRequired,
  advisorId: number.isRequired,
};

AdvisorsWorkingHoursCell.defaultProps = {
  value: {},
};

export default AdvisorsWorkingHoursCell;
