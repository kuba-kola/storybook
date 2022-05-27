import React from "react";
import { bool, func, string } from "prop-types";
import Button from "components/common/Button";

const BookAppointmentButton = ({ isAppointmentComplete, onClick, label }) => (
  <div className="appointmentDetailsSection">
    <Button
      variant="brand"
      fullWidth
      disabled={!isAppointmentComplete}
      onClick={onClick}
    >
      <p>{label || "Book appointment"}</p>
    </Button>
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
