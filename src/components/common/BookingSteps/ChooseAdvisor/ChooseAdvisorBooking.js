import { connect } from "react-redux";
import { activeAdvisorsSelector, settingsTeamServiceAdvisorsSelector } from "store/selectors/settings-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { fetchAdvisors, setCurrentStep, setServiceAdvisor } from "store/actions/booking-details-actions";
import { bookingDetailsSelectedServicesSelector } from "store/selectors/booking-details-selectors";
import ChooseAdvisor from "./index.js";

const mapStateToProps = (state) => ({
  selectedServices: bookingDetailsSelectedServicesSelector(state),
  teamServiceAdvisors: settingsTeamServiceAdvisorsSelector(state),
  serviceAdvisors: activeAdvisorsSelector(state),
  dealershipId: dealershipIdSelector(state),
});

const actions = {
  setSchedulingStep: setCurrentStep,
  makeAdvisorSelection: setServiceAdvisor,
  fetchTeamAdvisors: fetchAdvisors,
};
export default connect(mapStateToProps, actions)(ChooseAdvisor);
