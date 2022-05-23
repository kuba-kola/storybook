import { connect } from "react-redux";
import {
  setClientWaiting,
  setClientTransport,
  setCurrentStep,
  fetchTransport,
} from "store/actions/booking-details-actions";

import {
  bookingDetailsSelectedTransportSelector,
  bookingDetailsClientWaitingSelector,
  bookingDetailsAvailableTransportSelector,
  bookingDetailsAvailableTransportLoadingSelector,
  bookingDetailsAvailableTransportErrorSelector,
  bookingDetailsChosenTimeSlotSelector,
  bookingDetailsCurrentStepSelector,
} from "store/selectors/booking-details-selectors";
import Transportation from "./index.js";

const mapStateToProps = (state) => ({
  clientWaiting: bookingDetailsClientWaitingSelector(state),
  selectedTransport: bookingDetailsSelectedTransportSelector(state),
  chosenTimeSlot: bookingDetailsChosenTimeSlotSelector(state),
  currentStep: bookingDetailsCurrentStepSelector(state),
  availableTransports: bookingDetailsAvailableTransportSelector(state),
  availableTransportsLoading: bookingDetailsAvailableTransportLoadingSelector(state),
  availableTransportsLoadingError: bookingDetailsAvailableTransportErrorSelector(state),
});

const actions = {
  setIsWaiting: setClientWaiting,
  setTransport: setClientTransport,
  setSchedulingStep: setCurrentStep,
  fetchAvailableTransport: fetchTransport,
};

export default connect(mapStateToProps, actions)(Transportation);
