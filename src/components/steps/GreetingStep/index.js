import React, { Fragment } from "react";
import { string } from "prop-types";
import { connect } from "react-redux";

import { chatCustomerNameSelector } from "store/selectors/checkin-chat-selectors";
import { appDealershipNameSelector } from "store/selectors/checkin-app-selectors";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";
import { SOURCE_CONCIERGE } from "shared/constants/text-messages";

const GreetingStep = ({ customerName, dealershipName }) => (
  <>
    <AnimationGroup isComplete>
      <AnimatedTextMessage
        message={`Hello ${customerName ? `, ${customerName}` : ""}. Welcome to ${dealershipName}. My name is Carmen!`}
        source={SOURCE_CONCIERGE}
        isOpening
      />
    </AnimationGroup>
  </>
);

GreetingStep.propTypes = {
  customerName: string.isRequired,
  dealershipName: string.isRequired,
};

const mapStateToProps = (state) => ({
  dealershipName: appDealershipNameSelector(state),
  customerName: chatCustomerNameSelector(state),
});

export default connect(mapStateToProps, null)(GreetingStep);
