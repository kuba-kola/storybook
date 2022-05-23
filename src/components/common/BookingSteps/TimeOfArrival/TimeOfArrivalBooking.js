import { connect } from "react-redux";

import { fetchAvailableDays, setChosenTimeSlot, setCurrentStep } from "store/actions/booking-details-actions";
import {
  bookingDetailsAvailableDaysSelector,
  bookingDetailsChosenTimeSlotSelector,
  bookingDetailsTimeSlotsLoadingSelector,
  bookingDetailsTimeSlotsLoadingErrorSelector,
  bookingDetailsIsRemoteSelector,
} from "store/selectors/booking-details-selectors";

import TimeOfArrival from "./index";

const mapStateToProps = (state) => ({
  availableDays: bookingDetailsAvailableDaysSelector(state),
  chosenTimeSlot: bookingDetailsChosenTimeSlotSelector(state),
  timeSlotsLoading: bookingDetailsTimeSlotsLoadingSelector(state),
  timeSlotsLoadingError: bookingDetailsTimeSlotsLoadingErrorSelector(state),
  isRemote: bookingDetailsIsRemoteSelector(state),
});

const actions = {
  fetchDays: fetchAvailableDays,
  setChosenQuarterSlot: setChosenTimeSlot,
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(TimeOfArrival);
