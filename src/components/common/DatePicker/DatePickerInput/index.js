import React, { useRef } from "react";
import { string, bool } from "prop-types";

import calendarIcon from "assets/images/calendar.svg";

import "./styles.scss";

const DatePickerInput = ({
  error,
  label,
  inputClassName,
  isDatePicker,
  ...props
}) => {
  const focusInput = useRef(null);

  return (
    <div className="conciergeInputWrapper datepicker">
      <div className="conciergeInputLabel">{label}</div>
      <div
        className="conciergeInput"
        onClick={() => focusInput.current.focus()}
      >
        <img
          className="calendarIcon"
          src={calendarIcon}
          alt="calendarIcon"
        />
        <input
          className={inputClassName}
          ref={focusInput}
          {...props}
        />
      </div>

      <p className="conciergeInputError">{error}</p>
    </div>
  );
};

DatePickerInput.propTypes = {
  error: string,
  label: string,
  inputClassName: string,
  isDatePicker: bool,
};

DatePickerInput.defaultProps = {
  error: null,
  label: null,
  inputClassName: null,
  isDatePicker: false,
};

export default DatePickerInput;
