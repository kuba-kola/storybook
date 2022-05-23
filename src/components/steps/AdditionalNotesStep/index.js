import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bool, string } from "prop-types";

import { DELAY_500 } from "shared/constants/delays";
import { chatCustomerNameSelector, chatAdditionalNotesSelector } from "store/selectors/checkin-chat-selectors";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";

const AdditionalNotesStep = ({ isComplete, name, additionalNotes }) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage
        delay={DELAY_500}
        message="Is there anything else you would like to add?"
        source={SOURCE_CONCIERGE}
        isClosing
      />
    </AnimationGroup>
    {isComplete && (
      <AnimationGroup>
        <AnimatedTextMessage message={additionalNotes || "That's all."} source={SOURCE_USER} />
      </AnimationGroup>
    )}
    {isComplete && additionalNotes && (
      <AnimationGroup>
        <AnimatedTextMessage
          delay={DELAY_500}
          message={`Sure, ${name}. I'll keep that in mind.`}
          source={SOURCE_CONCIERGE}
          isOpening
        />
      </AnimationGroup>
    )}
  </>
);

AdditionalNotesStep.propTypes = {
  isComplete: bool,
  additionalNotes: string,
  name: string.isRequired,
};

AdditionalNotesStep.defaultProps = {
  isComplete: false,
  additionalNotes: "",
};

const mapStateToProps = (state) => ({
  name: chatCustomerNameSelector(state),
  additionalNotes: chatAdditionalNotesSelector(state),
});

const AdditionalNotesStepContainer = connect(mapStateToProps)(AdditionalNotesStep);

export default AdditionalNotesStepContainer;
