import { connect } from "react-redux";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { setCurrentStep, setServiceAdvisor, fetchAdvisors } from "store/actions/scheduling-process-actions";
import { schedulingSelectedServicesSelector } from "store/selectors/scheduling-process-selectors";
import { activeAdvisorsSelector, settingsTeamServiceAdvisorsSelector } from "store/selectors/settings-selectors";
import ChooseAdvisor from "./index.js";

const mapStateToProps = (state) => ({
  selectedServices: schedulingSelectedServicesSelector(state),
  teamServiceAdvisors: settingsTeamServiceAdvisorsSelector(state),
  serviceAdvisors: activeAdvisorsSelector(state),
  dealershipId: dealershipIdSelector(state),
});

const actions = {
  fetchTeamAdvisors: fetchAdvisors,
  setSchedulingStep: setCurrentStep,
  makeAdvisorSelection: setServiceAdvisor,
};

export default connect(mapStateToProps, actions)(ChooseAdvisor);
