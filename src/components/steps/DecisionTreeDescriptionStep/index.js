import React, { Fragment } from "react";
import { string, bool } from "prop-types";

import { DELAY_500 } from "shared/constants/delays";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";

const DecisionTreeDescriptionStep = ({ serviceName, description }) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage
        delay={DELAY_500}
        message={`Regarding your ${
          serviceName || "concern"
        }. Is there anything you want to add to your original statement?`}
        source={SOURCE_CONCIERGE}
        isClosing
      />
    </AnimationGroup>
    {description && (
      <AnimationGroup>
        <AnimatedTextMessage message={description} source={SOURCE_USER} />
      </AnimationGroup>
    )}
  </>
);

DecisionTreeDescriptionStep.propTypes = {
  description: string,
  serviceName: string,
};

DecisionTreeDescriptionStep.defaultProps = {
  description: "",
  serviceName: "",
};

export default DecisionTreeDescriptionStep;
