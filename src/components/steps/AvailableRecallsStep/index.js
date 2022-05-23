import React, { Fragment } from "react";
import { connect } from "react-redux";
import { func, bool } from "prop-types";

import { chatAvailableRecallsSelector, chatSelectedRecallsSelector } from "store/selectors/checkin-chat-selectors";
import { DELAY_500, DELAY_1000, DELAY_1500 } from "shared/constants/delays";
import { servicesPropType } from "shared/prop-types";
import { toggleRecall } from "store/actions/checkin-chat-actions";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";
import RecallService from "components/common/checkin/ExtensionService/RecallService";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

import styles from "./styles.module.scss";

const AvailableRecallsStep = ({
  isComplete, onToggle, availableRecalls, selectedRecalls,
}) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage
        delay={DELAY_500}
        message="There is also a safety recall available for your car."
        source={SOURCE_CONCIERGE}
        isOpening
      />
      <AnimatedTextMessage
        delay={DELAY_1000}
        message="Would you like to add this service to your booking?"
        source={SOURCE_CONCIERGE}
      />
      <Animation delay={DELAY_1500}>
        <div className={styles.services}>
          {availableRecalls.map((service) => (
            <RecallService
              key={service.id}
              service={service}
              onClick={isComplete ? () => null : () => onToggle(service)}
              isHighlighted={!!selectedRecalls.find(({ id }) => service.id === id)}
            />
          ))}
        </div>
      </Animation>
    </AnimationGroup>
    {isComplete && (
      <AnimationGroup>
        <AnimatedTextMessage
          message={
            selectedRecalls.length
              ? `Let's add this to the list: ${selectedRecalls.map((s) => s.name).join(", ")}`
              : "No, thanks."
          }
          source={SOURCE_USER}
        />
      </AnimationGroup>
    )}
  </>
);

AvailableRecallsStep.propTypes = {
  isComplete: bool,
  availableRecalls: servicesPropType.isRequired,
  selectedRecalls: servicesPropType,
  onToggle: func.isRequired,
};

AvailableRecallsStep.defaultProps = {
  isComplete: false,
  selectedRecalls: [],
};

const mapStateToProps = (state) => ({
  availableRecalls: chatAvailableRecallsSelector(state),
  selectedRecalls: chatSelectedRecallsSelector(state),
});

const actions = {
  onToggle: toggleRecall,
};

const AvailableRecallsStepContainer = connect(mapStateToProps, actions)(AvailableRecallsStep);

export default AvailableRecallsStepContainer;
