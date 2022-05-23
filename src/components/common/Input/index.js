import React from "react";
import cx from "classnames";
import { string, func } from "prop-types";

import "./styles.scss";

const Input = ({
  error,
  label,
  inputClassName,
  onChange,
  ...props
}) => (
  <div className="conciergeInputWrapper">
    <div className="conciergeInputLabel">{label}</div>
    <input
      className={cx("conciergeInput", inputClassName)}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
    <p className="conciergeInputError">{error}</p>
  </div>
);

Input.propTypes = {
  error: string,
  label: string,
  inputClassName: string,
  onChange: func.isRequired,
};

Input.defaultProps = {
  error: null,
  label: null,
  inputClassName: null,
};

export default Input;
