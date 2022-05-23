import React from "react";
import { instanceOf, bool, func } from "prop-types";
import { format } from "date-fns";
import cx from "classnames";
import { MONTH_DAY_FORMAT } from "shared/utils/datetime";

import "./styles.scss";

const DayCell = ({
  day,
  isOutOfMonth,
  isWithinRange,
  isCurrent,
  isSelected,
  isStartOfRange,
  isEndOfRange,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const dayCellClasses = cx({
    conciergeDayCell: true,
    outOfMonth: isOutOfMonth,
    withinRange: isWithinRange,
    today: isCurrent,
    selected: isSelected,
    startOfRange: isStartOfRange,
    endOfRange: isEndOfRange,
  });
  return (
    <div
      className={dayCellClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {format(day, MONTH_DAY_FORMAT)}
    </div>
  );
};

DayCell.propTypes = {
  day: instanceOf(Date).isRequired,
  isOutOfMonth: bool,
  isWithinRange: bool,
  isCurrent: bool,
  isSelected: bool,
  isStartOfRange: bool,
  isEndOfRange: bool,
  onClick: func.isRequired,
  onMouseEnter: func,
  onMouseLeave: func,
};

DayCell.defaultProps = {
  isOutOfMonth: false,
  isWithinRange: false,
  isCurrent: false,
  isSelected: false,
  isStartOfRange: false,
  isEndOfRange: false,
  onMouseEnter: null,
  onMouseLeave: null,
};

export default DayCell;
