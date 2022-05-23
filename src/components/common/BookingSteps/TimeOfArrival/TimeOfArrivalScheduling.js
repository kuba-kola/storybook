import { connect } from "react-redux";

import { fetchAvailableDays, setChosenTimeSlot, setCurrentStep } from "store/actions/scheduling-process-actions";
import {
  schedulingAvailableDaysSelector,
  schedulingChosenTimeSlotSelector,
  schedulingTimeSlotsLoadingSelector,
  schedulingTimeSlotsLoadingErrorSelector,
  schedulingIsRemoteSelector,
} from "store/selectors/scheduling-process-selectors";

import TimeOfArrival from "./index";

const mapStateToProps = (state) => ({
  availableDays: schedulingAvailableDaysSelector(state),
  chosenTimeSlot: schedulingChosenTimeSlotSelector(state),
  schedulingTimeSlotsLoading: schedulingTimeSlotsLoadingSelector(state),
  schedulingTimeSlotsLoadingError: schedulingTimeSlotsLoadingErrorSelector(state),
  isRemote: schedulingIsRemoteSelector(state),
});

const actions = {
  fetchDays: fetchAvailableDays,
  setChosenQuarterSlot: setChosenTimeSlot,
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(TimeOfArrival);
