import React, { Component } from "react";
import {
  arrayOf, bool, func, string, object, number,
} from "prop-types";
import { isEmpty, isNil } from "ramda";
import { connect } from "react-redux";

import {
  schedulingSearchStringSelector,
  schedulingCustomersSelector,
  schedulingLoadingStateSelector,
  schedulingErrorSelector,
  schedulingCustomerSavingSelector,
  schedulingCustomerSavingErrorSelector,
  schedulingSavedWithoutDmsNotificationSelector,
} from "store/selectors/scheduling-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { authTokenSelector } from "store/selectors/auth-selectors";
import { dmsTypeSelector } from "store/selectors/settings-selectors";
import {
  retrieveCustomers,
  sendCustomerData,
  resetDataEditionState,
} from "store/actions/scheduling-actions";
import { retrieveDealershipInfo } from "store/actions/settings-actions";
import { resetSchedulingProcessState } from "store/actions/scheduling-process-actions";
import { customerPropType } from "shared/prop-types";
import { customerFieldsCDK, customerFieldsDT } from "shared/fields";
import { determineSearchType, extractPhoneNumberFromString } from "shared/utils/common";
import { phoneNumberLengthValidator } from "shared/validators";
import { NotificationContainer, NotificationManager } from "react-notifications";

import PageHeader from "components/common/PageHeader";
import Panel from "components/common/Panel";
import SearchField from "components/common/SearchField";
import DataEditionModal from "components/common/DataEditionModal";
import CustomerDetails from "./CustomerDetails";

import "./styles.scss";

const PageTitle = () => <h2>Scheduling</h2>;

class SchedulingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: this.props.searchPhrase,
      error: this.props.error,
      customerDataModalVisible: false,
      searchType: null,
    };

    this.searchInput = React.createRef();
  }

  componentDidMount() {
    this.props.setSchedulingProcessInitialState();

    if (this.props.dmsType === "" && this.props.dealershipId) {
      this.props.fetchDealershipInfo(this.props.dealershipId, this.props.token);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { savedWithoutDmsNotification } = this.props;
    if (this.state.searchType && this.state.searchType !== prevState.searchType
        && this.state.error === null) {
      this.props.fetchCustomers(this.state.searchString, this.state.searchType);
    }

    if (this.props.searchPhrase !== prevProps.searchPhrase
        && this.props.searchPhrase !== prevProps.searchPhrase) {
      this.setState({ searchString: this.props.searchPhrase });
    }

    if (savedWithoutDmsNotification && savedWithoutDmsNotification !== prevProps.savedWithoutDmsNotification) {
      NotificationManager.warning(savedWithoutDmsNotification, "Warning");
      this.props.fetchCustomers(this.state.searchString, determineSearchType(this.state.searchString));
    }
  }

  validateSearchString = () => {
    this.setState({ error: null, searchType: null }, () => this.validate());
  };

  handleCustomerWindow = (boolean) => {
    const { resetDataEditionModalState } = this.props;
    this.setState((state) => ({
      ...state,
      customerDataModalVisible: boolean,
    }));

    if (!boolean) {
      resetDataEditionModalState();
    }
  }

  handleSearchStringChange = (searchString) => {
    this.setState({ searchString });
  }

  validate = () => {
    if (isEmpty(this.state.searchString)) {
      this.setState({ error: "Search phrase can't be blank." });
      return;
    }

    const searchType = determineSearchType(this.state.searchString);

    if (isNil(searchType)) {
      this.setState({ error: "Invalid search phrase given." });
      return;
    }

    if (searchType === "phone_number") {
      const phoneNumber = extractPhoneNumberFromString(this.state.searchString);
      const isValid = phoneNumberLengthValidator(phoneNumber, this.props.dmsType);

      if (isValid) {
        this.setState({ searchString: phoneNumber, searchType });
      } else {
        this.setState({ error: "Invalid search phrase given." });
      }
    } else {
      this.setState({ searchType });
    }
  }

  renderSearchResults = () => {
    const focusOnInputField = () => this.searchInput.current.focusOnInputField();
    const {
      customers,
      isLoading,
    } = this.props;
    const error = this.state.error || this.props.error;
    const customersList = customers.map((c) => (<CustomerDetails customer={c} key={c.id} focusOnInputField={focusOnInputField} />));
    const resultString = customers.length === 1 ? "result" : "results";

    if (isLoading) {
      return <Panel className="conciergeSchedulingLoadingPanel">Loading...</Panel>;
    }
    if (error) {
      return <Panel className="conciergeSchedulingLoadingPanel">{error}</Panel>;
    }
    if (customersList.length) {
      return (
        <section>
          {this.props.searchPhrase && (
            <p className="conciergeSchedulingResultsMsg">
              {customersList.length}
              {" "}
              {resultString}
              {" "}
              found
            </p>
          )}
          {customersList}
        </section>
      );
    }
    return null;
  };

  render() {
    const { dataEditionModalSaving, dataEditionModalSavingError } = this.props;
    return (
      <section className="conciergeSchedulingPage">
        <section className="conciergeSchedulingHeaderSection">
          <PageHeader title={<PageTitle />} />
        </section>
        <NotificationContainer />
        <section className="conciergeSchedulingPageMain">
          <section className="conciergeSchedulingAddButtonSection">
            <button type="button" className="conciergeSchedulingButton" onClick={() => this.handleCustomerWindow(true)}>
              Add new customer
            </button>
          </section>
          <Panel
            header={<p className="conciergeSchedulingSearchPanelHeader">Search for customer</p>}
            className="conciergeSchedulingPanel"
          >
            <SearchField
              ref={this.searchInput}
              placeholder="Phone number, full name or VIN"
              value={this.state.searchString}
              tooltipContent="Please press Enter to perform search"
              onEnter={this.validateSearchString}
              onChange={this.handleSearchStringChange}
            />
          </Panel>
          {this.renderSearchResults()}
          {
            !!this.state.customerDataModalVisible && (
            <DataEditionModal
              onClose={() => this.handleCustomerWindow(false)}
              title="New customer"
              fields={this.props.dmsType === "dealer_track" ? customerFieldsDT : customerFieldsCDK}
              onSubmit={(data) => this.props.saveCustomerData(data)}
              loading={dataEditionModalSaving}
              error={dataEditionModalSavingError}
            />
            )
          }
        </section>
      </section>
    );
  }
}

SchedulingPage.propTypes = {
  customers: arrayOf(customerPropType),
  searchPhrase: string.isRequired,
  error: string,
  fetchCustomers: func,
  isLoading: bool,
  saveCustomerData: func.isRequired,
  dataEditionModalSaving: bool.isRequired,
  // eslint-disable-next-line
  dataEditionModalSavingError: object.isRequired,
  resetDataEditionModalState: func.isRequired,
  dmsType: string,
  setSchedulingProcessInitialState: func.isRequired,
  fetchDealershipInfo: func.isRequired,
  dealershipId: number.isRequired,
  token: string.isRequired,
};

SchedulingPage.defaultProps = {
  customers: [],
  fetchCustomers: null,
  error: null,
  isLoading: false,
  dmsType: "",
};

const mapStateToProps = (state) => ({
  customers: schedulingCustomersSelector(state),
  searchPhrase: schedulingSearchStringSelector(state),
  error: schedulingErrorSelector(state),
  isLoading: schedulingLoadingStateSelector(state),
  dataEditionModalSaving: schedulingCustomerSavingSelector(state),
  dataEditionModalSavingError: schedulingCustomerSavingErrorSelector(state),
  savedWithoutDmsNotification: schedulingSavedWithoutDmsNotificationSelector(state),
  dmsType: dmsTypeSelector(state),
  dealershipId: dealershipIdSelector(state),
  token: authTokenSelector(state),
});

const actions = {
  fetchCustomers: retrieveCustomers,
  saveCustomerData: sendCustomerData,
  resetDataEditionModalState: resetDataEditionState,
  setSchedulingProcessInitialState: resetSchedulingProcessState,
  fetchDealershipInfo: retrieveDealershipInfo,
};

export default connect(mapStateToProps, actions)(SchedulingPage);
