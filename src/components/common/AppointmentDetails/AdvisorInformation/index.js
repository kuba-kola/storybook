import React from "react";

import { serviceAdvisorPropType } from "shared/prop-types";
import { imageUrl } from "shared/utils/common";

const AdvisorInformation = ({ advisor }) => (
  <div className="appointmentDetailsSection appointmentDetailsAdvisorSection">
    {advisor.photo?.url && <img className="appointmentDetailsAdvisorPhoto" src={imageUrl(advisor.photo)} alt="" />}
    <div className="appointmentDetailsAdvisorInfoContainer">
      <span className="appointmentDetailsAdvisorText">Selected advisor:</span>
      <span className="appointmentDetailsAdvisorName">{advisor.name}</span>
    </div>
  </div>
);

AdvisorInformation.propTypes = {
  advisor: serviceAdvisorPropType,
};

AdvisorInformation.defaultProps = {
  advisor: null,
};

export default AdvisorInformation;
