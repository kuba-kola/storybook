import React from "react";
import cx from "classnames";
import { func, string } from "prop-types";
import { timeInUSFormat } from "shared/utils/datetime";
import "../styles.scss";

const TimeSlot = ({
  timeSlot,
  isActive,
  disabled,
  onClick,
}) => (
  <button
    type="button"
    className={cx("timePickerViewBtn", "btn", {
      active: isActive,
      timePickerViewBtnDisabled: disabled,
    })}
    onClick={onClick}
  >
    {timeInUSFormat(timeSlot)}
  </button>
);

TimeSlot.propTypes = {
  timeSlot: string.isRequired,
  onClick: func.isRequired,
};

export default TimeSlot;
