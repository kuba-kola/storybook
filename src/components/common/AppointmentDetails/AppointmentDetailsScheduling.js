import { connect } from "react-redux";

import {
  schedulingSelectedServicesSelector,
  schedulingSelectedRecallsSelector,
  schedulingCurrentVehicleSelector,
  schedulingCurrentCustomerSelector,
  schedulingChosenTimeSlotSelector,
  schedulingSelectedAdvisorSelector,
  schedulingProcessSendSmsSelector,
  schedulingProcessContactNumberSelector,
  schedulingIsRemoteSelector,
  schedulingRemoteJobDataSelector,
} from "store/selectors/scheduling-process-selectors";

import AppointmentDetails from "./index";

const mapStateToProps = (state) => ({
  selectedServices: schedulingSelectedServicesSelector(state),
  selectedRecalls: schedulingSelectedRecallsSelector(state),
  selectedAdvisor: schedulingSelectedAdvisorSelector(state),
  vehicle: schedulingCurrentVehicleSelector(state),
  customer: schedulingCurrentCustomerSelector(state),
  chosenTimeSlot: schedulingChosenTimeSlotSelector(state),
  sendSms: schedulingProcessSendSmsSelector(state),
  contactNumber: schedulingProcessContactNumberSelector(state),
  isRemote: schedulingIsRemoteSelector(state),
  remoteJobData: schedulingRemoteJobDataSelector(state),
});

export default connect(mapStateToProps)(AppointmentDetails);
