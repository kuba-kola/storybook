import React, { Fragment } from "react";
import { string, bool } from "prop-types";
import { connect } from "react-redux";

import { DELAY_500, DELAY_1000, DELAY_1500 } from "shared/constants/delays";
import { chatIsPickupJobCheckinSelector } from "store/selectors/checkin-chat-selectors";

import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";
import BookingDetails from "components/common/checkin/BookingDetails";

const BookingConfirmationStep = ({
  isPickupJobCheckin, delayed, isEditing, isComplete, textFromUser, isBare,
}) => (
  <>
    <AnimationGroup>
      {!isBare && (
      <AnimatedTextMessage
        delay={delayed ? DELAY_1000 : DELAY_500}
        message={`Please confirm your ${isPickupJobCheckin ? "pickup" : "reservation"}:`}
        source={SOURCE_CONCIERGE}
      />
      )}
      <Animation delay={delayed ? DELAY_1500 : DELAY_1000}>
        <BookingDetails isEditing={isEditing} />
      </Animation>
    </AnimationGroup>
    {isComplete && (
    <AnimationGroup>
      <AnimatedTextMessage message="Yeah, that's right" source={SOURCE_USER} />
    </AnimationGroup>
    )}
    {textFromUser && (
    <AnimationGroup>
      <AnimatedTextMessage message={textFromUser} source={SOURCE_USER} />
    </AnimationGroup>
    )}
  </>
);

BookingConfirmationStep.propTypes = {
  textFromUser: string,
  isComplete: bool,
  isEditing: bool,
  delayed: bool,
};

BookingConfirmationStep.defaultProps = {
  textFromUser: "",
  isComplete: false,
  delayed: false,
  isEditing: false,
};

const mapStateToProps = (state) => ({
  isPickupJobCheckin: chatIsPickupJobCheckinSelector(state),
});

const BookingConfirmationStepContainer = connect(mapStateToProps)(BookingConfirmationStep);

export default BookingConfirmationStepContainer;
