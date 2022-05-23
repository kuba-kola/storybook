import React, { Component } from "react";
import { DELAY_1000, DELAY_1500 } from "shared/constants/delays";
import { SOURCE_CONCIERGE } from "shared/constants/text-messages";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

class FinalStep extends Component {
  render() {
    return (
      <AnimationGroup>
        <AnimatedTextMessage
          delay={DELAY_1000}
          message="You are checked in. I'll keep you posted on the progress via SMS."
          source={SOURCE_CONCIERGE}
        />
        <AnimatedTextMessage
          delay={DELAY_1500}
          message="Thank you for your business."
          source={SOURCE_CONCIERGE}
          isClosing
        />
      </AnimationGroup>
    );
  }
}

export default FinalStep;
