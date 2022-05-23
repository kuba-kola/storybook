import React from "react";
import {
  string, number, func, arrayOf, shape, bool, oneOfType,
} from "prop-types";

import StyledSelect from "components/common/StyledSelect";
import arrowRightIcon from "assets/images/right.svg";

import "./styles.scss";

const TextStep = ({
  label,
  text,
  abbreviation,
  goto,
  onChange,
  steps,
  canDelete,
  onDelete,
  disabled,
}) => (
  <div className="TextStep">
    <div className="TextStepHeader">
      <span className="TextStepHeaderLabel">{label}</span>
      {canDelete && !disabled && (
        <button type="button" className="TextStepHeaderDelete" onClick={onDelete}>
          <div className="TextStepHeaderDeleteIcon" />
          Delete
        </button>
      )}
    </div>
    <div className="TextStepBody">
      <div className="TextStepBodyColumn">
        <span className="TextStepBodyLabel">Message content</span>
        <div className="TextStepBodyRow">
          <input
            type="text"
            value={text}
            onChange={(e) => onChange(e.target.value, goto, abbreviation)}
            placeholder="Type here..."
            className="TextStepBodyInput"
            disabled={disabled}
          />
          <img alt="arrow" src={arrowRightIcon} />
        </div>
      </div>
      <div className="TextStepBodyColumn">
        <span className="TextStepBodyLabel">Go to</span>
        <StyledSelect
          className="TextStepBodySelect"
          value={steps.find((s) => s.value === goto)}
          onChange={(e) => onChange(text, e.value, abbreviation)}
          options={steps}
          disabled={disabled}
        />
      </div>
      <div className="TextStepBodyColumn TextStepBodyColumnAbbreviation">
        <span className="TextStepBodyLabel">Abbreviation</span>
        <div className="TextStepBodyRow">
          <input
            type="text"
            value={abbreviation}
            onChange={(e) => onChange(text, goto, e.target.value)}
            placeholder="Type here..."
            className="TextStepBodyInput"
            disabled={disabled}
            maxLength={50}
          />
        </div>
      </div>
    </div>
  </div>
);

TextStep.propTypes = {
  label: string.isRequired,
  text: string,
  abbreviation: string,
  goto: oneOfType([number, string]),
  onChange: func.isRequired,
  steps: arrayOf(shape({ value: oneOfType([number, string]), label: string })),
  canDelete: bool,
  onDelete: func,
  disabled: bool,
};

TextStep.defaultProps = {
  text: "",
  abbreviation: "",
  goto: null,
  steps: [],
  canDelete: false,
  onDelete: null,
  disabled: false,
};

export default TextStep;
