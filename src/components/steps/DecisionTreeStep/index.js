import React, { Fragment } from "react";
import { string } from "prop-types";

import { DELAY_500 } from "shared/constants/delays";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

const DecisionTreeStep = ({ question, answer }) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage delay={DELAY_500} message={question} source={SOURCE_CONCIERGE} />
    </AnimationGroup>
    {answer && (
      <AnimationGroup>
        <AnimatedTextMessage message={answer} source={SOURCE_USER} />
      </AnimationGroup>
    )}
  </>
);

DecisionTreeStep.propTypes = {
  question: string.isRequired,
  answer: string,
};

DecisionTreeStep.defaultProps = {
  answer: "",
};

export default DecisionTreeStep;
