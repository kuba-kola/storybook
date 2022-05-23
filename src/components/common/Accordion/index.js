import React, { useState, useEffect } from "react";
import {
  string, element, bool, number, func,
} from "prop-types";
import cx from "classnames";
import { isEmpty } from "ramda";

import arrowDownIcon from "assets/images/down.svg";
import arrowUpIcon from "assets/images/up.svg";
import maintenanceIcon from "assets/images/bookings/maintenance.svg";
import concernIcon from "assets/images/bookings/concern.svg";

import "./styles.scss";

const Accordion = ({
  title,
  selectedValue,
  children,
  customClass,
  expandable,
  maintenanceCount,
  concernCount,
  currentStep,
  step,
  setSchedulingStep,
  isInitiallyExpanded,
}) => {
  const [isExpanded, setExpanded] = useState(expandable ? isInitiallyExpanded : true);

  useEffect(() => {
    if (currentStep === step) {
      setExpanded(true);
    } else if (expandable) {
      setExpanded(false);
    }
  }, [currentStep]);

  const changeExpandedStep = () => {
    setExpanded(!isExpanded);
    setSchedulingStep(step);
  };

  return (
    <div className={cx("accordion", { isExpanded }, customClass)}>
      <button
        type="button"
        className={cx("accordionExpandButton", { isExpanded })}
        onClick={expandable ? () => changeExpandedStep() : null}
      >
        <div className="accordionExpandButtonLeftPart">
          {expandable
            ? <img className="accordionExpandButtonLeftPartImage" alt="collapse" src={isExpanded ? arrowUpIcon : arrowDownIcon} />
            : null}
          <span>{title}</span>
        </div>
        <div className="accordionExpandButtonRightPart">
          {
            (!!maintenanceCount && !isExpanded) && (
              <div className="accordionExpandButtonCounterWrapper">
                <img className="accordionExpandButtonCounterImage" src={maintenanceIcon} alt="Maintenance count" />
                <span className="accordionExpandButtonCounter">
                  {maintenanceCount}
                </span>
              </div>
            )
          }
          {
            (!!concernCount && !isExpanded) && (
              <div className="accordionExpandButtonCounterWrapper">
                <img className="accordionExpandButtonCounterImage" src={concernIcon} alt="Concern count" />
                <span className="accordionExpandButtonCounter accordionExpandButtonCounterRed">
                  {concernCount}
                </span>
              </div>
            )
          }
          {
            (!isEmpty(selectedValue) && !isExpanded) && (
              <span>{selectedValue}</span>
            )
          }
        </div>
      </button>
      <div className={cx("accordionContent", { isExpanded })}>
        { children }
      </div>
    </div>
  );
};

Accordion.propTypes = {
  title: string,
  children: element.isRequired,
  customClass: string,
  expandable: bool,
  maintenanceCount: number,
  concernCount: number,
  currentStep: string,
  step: number,
  setSchedulingStep: func.isRequired,
  isInitiallyExpanded: bool,
  selectedValue: string,
};

Accordion.defaultProps = {
  customClass: "",
  title: "",
  expandable: true,
  maintenanceCount: 0,
  concernCount: 0,
  currentStep: "",
  step: null,
  isInitiallyExpanded: false,
  selectedValue: null,
};

export default Accordion;
