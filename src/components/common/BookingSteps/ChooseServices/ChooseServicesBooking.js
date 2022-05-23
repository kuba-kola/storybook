import { connect } from "react-redux";
import {
  bookingDetailsDealershipMenuItemsSelector,
  bookingDetailsSelectedServicesSelector,
  bookingDetailsMenuItemsLoadingSelector,
  bookingDetailsMenuItemsLoadingErrorSelector,
} from "store/selectors/booking-details-selectors";
import { setServiceSelection, setCurrentStep, fetchMenuItems } from "store/actions/booking-details-actions";
import ChooseServices from "./index";

const mapStateToProps = (state) => ({
  dealershipMenuItems: bookingDetailsDealershipMenuItemsSelector(state),
  selectedServices: bookingDetailsSelectedServicesSelector(state),
  menuItemsLoading: bookingDetailsMenuItemsLoadingSelector(state),
  menuItemsLoadingError: bookingDetailsMenuItemsLoadingErrorSelector(state),
});

const actions = {
  makeServiceSelection: setServiceSelection,
  setSchedulingStep: setCurrentStep,
  retrieveDealershipMenuItems: fetchMenuItems,
};

export default connect(mapStateToProps, actions)(ChooseServices);
