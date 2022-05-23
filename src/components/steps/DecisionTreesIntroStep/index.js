import React from "react";

import { DELAY_500 } from "shared/constants/delays";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";
import { SOURCE_CONCIERGE } from "shared/constants/text-messages";

const DecisionTreesIntroStep = () => (
  <AnimationGroup>
    <AnimatedTextMessage
      delay={DELAY_500}
      isOpening
      source={SOURCE_CONCIERGE}
      message="I'd like to know more about your concerns regarding your car."
    />
  </AnimationGroup>
);

export default DecisionTreesIntroStep;
