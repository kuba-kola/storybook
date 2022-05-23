import React from "react";
import {
  string, number, func, arrayOf, shape, oneOfType, bool,
} from "prop-types";

import StyledSelect from "components/common/StyledSelect";
import arrowRightIcon from "assets/images/right.svg";

import "./styles.scss";

const QuestionStep = ({
  label,
  text,
  answers,
  abbreviation,
  onChange,
  steps,
  onDelete,
  disabled,
}) => (
  <div className="QuestionStep">
    <div className="QuestionStepHeader">
      <span className="QuestionStepHeaderLabel">{label}</span>
      {!disabled && (
        <button type="button" className="QuestionStepHeaderDelete" onClick={onDelete}>
          <div className="QuestionStepHeaderDeleteIcon" />
          Delete
        </button>
      )}
    </div>
    <div className="QuestionStepBody">
      <div className="QuestionStepBodyInner">
        <div className="QuestionStepBodyInnerLeft">
          <span className="QuestionStepBodyLabel">Question for the user</span>
          <input
            type="text"
            value={text}
            onChange={(e) => onChange(e.target.value, answers, abbreviation)}
            placeholder="Type here..."
            className="QuestionStepTextInput"
            disabled={disabled}
          />
        </div>
        <div className="QuestionStepBodyInnerRight">
          <span className="QuestionStepBodyLabel">Abbreviation</span>
          <input
            type="text"
            value={abbreviation}
            onChange={(e) => onChange(text, answers, e.target.value)}
            placeholder="Type here..."
            className="QuestionStepTextInput"
            disabled={disabled}
            maxLength={50}
          />
        </div>
      </div>
      <div className="QuestionStepBodyAnswers">
        {answers.map((answer, index) => (
          <div key={`Answer ${index + 1}`} className="QuestionStepBodyAnswer">
            <div className="QuestionStepBodyColumn">
              <span className="QuestionStepBodyLabel">User answer</span>
              <div className="QuestionStepBodyRow">
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => onChange(text, answers.map((a) => (
                    a !== answer ? a : { ...a, text: e.target.value }
                  )), abbreviation)}
                  placeholder="Type here..."
                  className="QuestionStepBodyInput"
                  disabled={disabled}
                />
                <img alt="arrow" src={arrowRightIcon} />
              </div>
            </div>
            <div className="QuestionStepBodyColumn">
              <span className="QuestionStepBodyLabel">Go to</span>
              <StyledSelect
                className="QuestionStepBodySelect"
                value={steps.find((s) => s.value === answer.goto)}
                onChange={(e) => onChange(text, answers.map((a) => (
                  a !== answer ? a : { ...a, goto: e.value }
                )), abbreviation)}
                options={steps}
                disabled={disabled}
              />
            </div>
            <div className="QuestionStepBodyColumn QuestionStepBodyColumnAbbreviation">
              <span className="QuestionStepBodyLabel">Abbreviation</span>
              <input
                type="text"
                value={answer.abbreviation}
                onChange={(e) => onChange(text, answers.map((a) => (
                  a !== answer ? a : { ...a, abbreviation: e.target.value }
                )), abbreviation)}
                placeholder="Type here..."
                className="QuestionStepBodyInput"
                disabled={disabled}
                maxLength={50}
              />
            </div>
            { !disabled && (
              <button
                type="button"
                className="QuestionStepHeaderDelete"
                onClick={() => onChange(text, answers.filter((a) => a !== answer), abbreviation)}
              >
                <div className="QuestionStepHeaderDeleteIcon" />
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      {!disabled && (
        <button
          type="button"
          className="QuestionStepAddNewButton"
          onClick={() => onChange(text, [...answers, { text: "" }], abbreviation)}
        >
          + Add answer
        </button>
      )}
    </div>
  </div>
);

QuestionStep.propTypes = {
  label: string.isRequired,
  text: string,
  abbreviation: string,
  answers: arrayOf(shape({ text: string, goto: oneOfType([number, string]) })),
  onChange: func.isRequired,
  steps: arrayOf(shape({ value: oneOfType([number, string]), label: string })),
  onDelete: func,
  disabled: bool,
};

QuestionStep.defaultProps = {
  text: "",
  abbreviation: "",
  answers: [],
  steps: [],
  onDelete: null,
  disabled: false,
};

export default QuestionStep;
