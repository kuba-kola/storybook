import React from "react";

import {
  bool,
  string,
  func,
} from "prop-types";

import "./styles.scss";

const RadioButton = ({
  isChecked,
  labelText,
  onClick,
  radioButtonId,
}) => (
  <label htmlFor={radioButtonId} className="radioButtonContainer">
    <input
      id={radioButtonId}
      type="radio"
      checked={isChecked}
      onClick={onClick}
    />
    <div className="circleRadioButton" />
    <span className="circleRadioButtonLabel">{labelText}</span>
  </label>
);

RadioButton.propTypes = {
  isChecked: bool.isRequired,
  labelText: string.isRequired,
  onClick: func.isRequired,
  radioButtonId: string.isRequired,
};

export default RadioButton;
