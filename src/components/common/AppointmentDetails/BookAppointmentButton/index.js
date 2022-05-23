import React from "react";
import { bool, func, string } from "prop-types";
import cx from "classnames";

const BookAppointmentButton = ({ isAppointmentComplete, onClick, label }) => (
  <div className="appointmentDetailsSection">
    <button
      type="button"
      className={cx(
        "conciergeSchedulingButton",
        "conciergeSchedulingBookButton",
        { conciergeSchedulingButtonDisabled: !isAppointmentComplete },
      )}
      disabled={!isAppointmentComplete}
      onClick={onClick}
    >
      {label || "Book appointment"}
    </button>
  </div>
);

BookAppointmentButton.propTypes = {
  isAppointmentComplete: bool,
  onClick: func.isRequired,
  label: string,
};

BookAppointmentButton.defaultProps = {
  isAppointmentComplete: false,
  label: null,
};

export default BookAppointmentButton;
