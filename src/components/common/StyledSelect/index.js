import React from "react";
import {
  shape, string, func, arrayOf, any, bool,
} from "prop-types";
import Select from "react-select";
import cx from "classnames";

import "./styles.scss";

const StyledSelect = ({
  value,
  className,
  onChange,
  onInputChange,
  options,
  error,
  disabled,
  isOptionDisabled,
}) => (
  <>
    <Select
      isSearchable
      className={cx("StyledSelect", className)}
      classNamePrefix="StyledSelect"
      value={value}
      menuPlacement="auto"
      onInputChange={onInputChange}
      onChange={onChange}
      options={options}
      isDisabled={disabled}
      isOptionDisabled={isOptionDisabled}
    />
    <p className="conciergeInputError">{error}</p>
  </>
);

StyledSelect.propTypes = {
  value: shape({ label: string, value: any }),
  className: string,
  onChange: func,
  options: arrayOf(shape({ label: string, value: any })),
  error: string,
  disabled: bool,
  isOptionDisabled: func,
};

StyledSelect.defaultProps = {
  value: null,
  className: "",
  onChange: null,
  options: [],
  error: null,
  disabled: false,
  isOptionDisabled: null,
};

export default StyledSelect;
