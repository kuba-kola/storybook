import { connect } from "react-redux";
import {
  setClientWaiting,
  setClientTransport,
  setCurrentStep,
  fetchTransport,
} from "store/actions/scheduling-process-actions";

import {
  schedulingSelectedTransportSelector,
  schedulingClientWaitingSelector,
  schedulingAvailableTransportSelector,
  schedulingAvailableTransportLoadingSelector,
  schedulingAvailableTransportErrorSelector,
  schedulingChosenTimeSlotSelector,
  schedulingCurrentStepSelector,
  schedulingSelectedServicesSelector,
} from "store/selectors/scheduling-process-selectors";

import Transportation from "./index.js";

const mapStateToProps = (state) => ({
  clientWaiting: schedulingClientWaitingSelector(state),
  selectedTransport: schedulingSelectedTransportSelector(state),
  selectedServices: schedulingSelectedServicesSelector(state),
  chosenTimeSlot: schedulingChosenTimeSlotSelector(state),
  currentStep: schedulingCurrentStepSelector(state),
  availableTransports: schedulingAvailableTransportSelector(state),
  availableTransportsLoading: schedulingAvailableTransportLoadingSelector(state),
  availableTransportsLoadingError: schedulingAvailableTransportErrorSelector(state),
});

const actions = {
  setIsWaiting: setClientWaiting,
  setTransport: setClientTransport,
  setSchedulingStep: setCurrentStep,
  fetchAvailableTransport: fetchTransport,
};

export default connect(mapStateToProps, actions)(Transportation);
