import React from "react";
import cx from "classnames";
import { func } from "prop-types";

import { imageUrl } from "shared/utils/common";
import { serviceAdvisorPropType } from "shared/prop-types";

import "./styles.scss";

const AdvisorButton = ({
  serviceAdvisor,
  selectedAdvisor,
  onClickHandler,
}) => (
  <button
    type="button"
    className={cx(
      "conciergeSchedulingAdvisorButton",
      { conciergeSchedulingAdvisorButtonActive: selectedAdvisor.id === serviceAdvisor.id },
    )}
    onClick={onClickHandler}
  >
    <img
      src={imageUrl(serviceAdvisor.photo)}
      alt=""
      className="conciergeSchedulingAdvisorButtonAdvisorPhoto"
    />
    <span className="conciergeSchedulingAdvisorButtonAdvisorName">{serviceAdvisor.name}</span>
  </button>
);

AdvisorButton.propTypes = {
  serviceAdvisor: serviceAdvisorPropType.isRequired,
  selectedAdvisor: serviceAdvisorPropType.isRequired,
  onClickHandler: func.isRequired,
};

export default AdvisorButton;
