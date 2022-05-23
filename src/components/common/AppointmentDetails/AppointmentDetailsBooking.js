import { connect } from "react-redux";

import {
  bookingDetailsSelectedServicesSelector,
  bookingDetailsVehicleSelector,
  bookingDetailsCustomerSelector,
  bookingDetailsChosenTimeSlotSelector,
  bookingDetailsSelectedAdvisorSelector,
  bookingDetailsSendSmsSelector,
  bookingDetailsContactNumberSelector,
  bookingDetailsIsRemoteSelector,
  bookingDetailsRemoteJobDataSelector,
} from "store/selectors/booking-details-selectors";
import { setSendSms } from "store/actions/booking-details-actions";

import AppointmentDetails from "./index";

const mapStateToProps = (state) => ({
  selectedServices: bookingDetailsSelectedServicesSelector(state),
  selectedAdvisor: bookingDetailsSelectedAdvisorSelector(state),
  vehicle: bookingDetailsVehicleSelector(state),
  customer: bookingDetailsCustomerSelector(state),
  chosenTimeSlot: bookingDetailsChosenTimeSlotSelector(state),
  sendSms: bookingDetailsSendSmsSelector(state),
  contactNumber: bookingDetailsContactNumberSelector(state),
  isRemote: bookingDetailsIsRemoteSelector(state),
  remoteJobData: bookingDetailsRemoteJobDataSelector(state),
});

export default connect(mapStateToProps, {
  setSendTextMessage: setSendSms,
})(AppointmentDetails);
