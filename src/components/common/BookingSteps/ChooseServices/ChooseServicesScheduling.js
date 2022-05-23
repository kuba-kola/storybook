import { connect } from "react-redux";
import {
  schedulingDealershipMenuItemsSelector,
  schedulingSelectedServicesSelector,
  schedulingMenuItemsLoadingSelector,
  schedulingMenuItemsLoadingErrorSelector,
} from "store/selectors/scheduling-process-selectors";
import { setServiceSelection, setCurrentStep, fetchMenuItems } from "store/actions/scheduling-process-actions";
import ChooseServices from "./index";

const mapStateToProps = (state) => ({
  dealershipMenuItems: schedulingDealershipMenuItemsSelector(state),
  selectedServices: schedulingSelectedServicesSelector(state),
  menuItemsLoading: schedulingMenuItemsLoadingSelector(state),
  menuItemsLoadingError: schedulingMenuItemsLoadingErrorSelector(state),
});

const actions = {
  makeServiceSelection: setServiceSelection,
  setSchedulingStep: setCurrentStep,
  retrieveDealershipMenuItems: fetchMenuItems,
};

export default connect(mapStateToProps, actions)(ChooseServices);
