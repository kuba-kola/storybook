import React from "react";
import {
  func, string, number, bool,
} from "prop-types";
import cx from "classnames";

import "./styles.scss";

const ServiceTypeToggler = ({
  label,
  onClick,
  counter,
  icon,
  isActive,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "serviceTogglerButton",
      {
        serviceTogglerButtonBlueBg: isActive,
      },
    )}
  >
    {icon && <img className="serviceTogglerImage" src={icon} alt="Service type" />}
    <span className="serviceTogglerLabel">
      {label}
    </span>
    {counter
      ? (
        <span className="serviceTogglerCounter">
          {counter}
        </span>
      )
      : null }
  </button>
);

ServiceTypeToggler.propTypes = {
  onClick: func.isRequired,
  label: string.isRequired,
  counter: number,
  icon: string.isRequired,
  isActive: bool.isRequired,
  isScheduler: bool.isRequired,
};

ServiceTypeToggler.defaultProps = {
  counter: null,
};

export default ServiceTypeToggler;
