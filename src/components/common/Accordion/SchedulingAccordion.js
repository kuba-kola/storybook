import { connect } from "react-redux";

import { setCurrentStep } from "store/actions/scheduling-process-actions";
import { schedulingCurrentStepSelector } from "store/selectors/scheduling-process-selectors";
import Accordion from "./index";

const mapStateToProps = (state) => ({
  currentStep: schedulingCurrentStepSelector(state),
});

const actions = {
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(Accordion);
