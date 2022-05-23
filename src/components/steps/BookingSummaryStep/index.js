import React, { Fragment } from "react";
import { bool } from "prop-types";
import { connect } from "react-redux";

import { DELAY_500, DELAY_1000 } from "shared/constants/delays";
import { chatIsPickupJobCheckinSelector } from "store/selectors/checkin-chat-selectors";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

import BookingDetails from "components/common/checkin/BookingDetails";

const BookingSummaryStep = ({ isPickupJobCheckin, isComplete, isEditing }) => (
  <>
    <AnimationGroup>
      <AnimatedTextMessage
        delay={DELAY_500}
        message={`Great! Here is the summary of your ${isPickupJobCheckin ? "pickup" : "reservation"}`}
        source={SOURCE_CONCIERGE}
        isOpening
      />
      <Animation delay={DELAY_1000}>
        <BookingDetails isEditing={isEditing} />
      </Animation>
    </AnimationGroup>
    {isComplete && (
    <AnimationGroup>
      <AnimatedTextMessage message="Great, let's do this!" source={SOURCE_USER} />
    </AnimationGroup>
    )}
  </>
);

BookingSummaryStep.propTypes = {
  isPickupJobCheckin: bool.isRequired,
  isComplete: bool,
  isEditing: bool,
};

BookingSummaryStep.defaultProps = {
  isComplete: false,
  isEditing: false,
};

const mapStateToProps = (state) => ({
  isPickupJobCheckin: chatIsPickupJobCheckinSelector(state),
});

const BookingSummaryStepContainer = connect(mapStateToProps)(BookingSummaryStep);

export default BookingSummaryStepContainer;
