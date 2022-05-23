import { connect } from "react-redux";

import { setCurrentStep } from "store/actions/booking-details-actions";
import { bookingDetailsCurrentStepSelector } from "store/selectors/booking-details-selectors";
import Accordion from "./index";

const mapStateToProps = (state) => ({
  currentStep: bookingDetailsCurrentStepSelector(state),
});

const actions = {
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(Accordion);
