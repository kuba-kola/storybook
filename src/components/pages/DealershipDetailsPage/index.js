import React, { Component } from "react";
import { match as matchType } from "react-router-prop-types";
import {
  string, func, object, bool, arrayOf, number,
} from "prop-types";
import { connect } from "react-redux";
import { identity, isNil, isEmpty } from "ramda";

import {
  dealershipDetailsErrorSelector,
  dealershipDetailsLoadingStateSelector,
  dealershipDetailsDataSelector,
  dealershipDetailsMaintainersSelector,
} from "store/selectors/dealership-details-selectors";
import { retrieveDealershipDetails } from "store/actions/dealership-details-actions";
import { changeDealershipInfo } from "store/actions/settings-actions";

import { formatIntegrationSettingName } from "shared/utils/common";
import { availableTimezones } from "shared/utils/datetime";

import StyledSelect from "components/common/StyledSelect";
import PageHeader from "components/common/PageHeader";
import Panel from "components/common/Panel";
import Block from "components/common/Block";
import Input from "components/common/Input";
import HeaderEdit from "components/common/HeaderEdit";
import AddIntegrationModal from "./AddIntegrationModal";
import DealershipMaintaniers from "./DealershipMaintaners";
import IntegrationsPanel from "../SettingsPage/GeneralTab/IntegrationsPanel";

import "./styles.scss";

const PageTitle = ({ name }) => (
  <>
    <h2>Dealerships / </h2>
    <span>{name}</span>
  </>
);

PageTitle.propTypes = {
  name: string,
};

PageTitle.defaultProps = {
  name: "",
};

class DealershipDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealershipId: null,
      isModalOpen: false,
      isEditing: false,
      name: "",
      address: "",
      time_zone: "",
      phone: "",
      dealership_admin_email: [],
    };
  }

  componentDidMount() {
    const { fetchDealershipDetails, match, dealership } = this.props;
    if (!isNil(dealership) && dealership.id !== this.state.dealershipId) {
      const {
        id, name, address, time_zone, phone,
      } = dealership;
      this.setState({
        dealershipId: id,
        name,
        address,
        time_zone,
        phone,
      });
    }
    if (
      isNil(dealership)
      || isEmpty(dealership)
      || (!isEmpty(dealership)
        && !isNil(dealership)
        && dealership.id
        && dealership.id !== match.params.id)
    ) {
      fetchDealershipDetails(match.params.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { dealership } = this.props;
    if (
      !isNil(dealership)
      && dealership.id !== prevProps.dealership.id
    ) {
      const {
        id, name, address, time_zone, phone,
      } = dealership;
      this.setState({
        dealershipId: id,
        name,
        address,
        time_zone,
        phone,
      });
    }
  }

  openModal = () => this.setState({ isModalOpen: true });

  closeModal = () => this.setState({ isModalOpen: false });

  handleInputChange = (fieldName, value) => {
    if (this.state.isEditing) {
      this.setState({ [fieldName]: value });
    }
  };

  enableEditing = () => this.setState({ isEditing: true });

  cancelChanges = () => {
    const {
      name, address, time_zone, phone,
    } = this.props.dealership;

    this.setState({
      name: name || "",
      address: address || "",
      time_zone: time_zone || "",
      phone: phone || "",
      isEditing: false,
    });
  };

  saveChanges = () => {
    const { updateDealershipInfo } = this.props;
    const {
      dealershipId, name, address, phone, time_zone,
    } = this.state;
    const dataToSend = new FormData();
    dataToSend.append("name", name);
    dataToSend.append("address", address);
    dataToSend.append("phone", phone);
    dataToSend.append("time_zone", time_zone);
    dataToSend.append("tax_rate", this.props.dealership.tax_rate);

    updateDealershipInfo(dealershipId, dataToSend);
    this.setState({ isEditing: false });
  };

  renderContent() {
    const {
      isEditing, name, address, time_zone, phone,
    } = this.state;
    const {
      dealership: { integrations },
      isLoading,
      error,
    } = this.props;
    const preparedTimezoneOptions = availableTimezones().map((availableTimezone) => (
      { label: availableTimezone, value: availableTimezone }
    ));
    const defaultOption = { label: "", value: "" };
    const selectedTimezone = preparedTimezoneOptions.find((timezoneOption) => (
      timezoneOption.value === time_zone
    ));
    const timezoneOptions = selectedTimezone
      ? preparedTimezoneOptions : [defaultOption, ...preparedTimezoneOptions];

    if (isLoading) {
      return (
        <Panel className="conciergeDealershipDetailsLoadingPanel">
          Loading...
        </Panel>
      );
    }
    if (error) {
      return (
        <Panel className="conciergeDealershipDetailsLoadingPanel">
          {error.data.error || error.data || error.toString()}
        </Panel>
      );
    }

    return (
      <>
        <Panel
          header={(
            <>
              <label>Dealership details</label>
              <HeaderEdit
                isEditing={isEditing}
                handleCancel={this.cancelChanges}
                handleEdit={this.enableEditing}
                handleSave={this.saveChanges}
              />
            </>
          )}
          className="conciergeDealershipDetailsGeneralPanel"
        >
          <Input
            label="Name"
            type="text"
            value={name}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("name", value)}
          />
          <Input
            label="Address"
            type="text"
            value={address}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("address", value)}
          />
          <Input
            label="Phone"
            type="text"
            value={phone}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("phone", value)}
          />
          <div className="conciergeInputWrapper">
            <div className="conciergeInputLabel">
              Dealership&apos;s  timezone
            </div>
            <StyledSelect
              className="dealershipsAddDealershipModalSelect"
              key="dealership_timezone"
              options={timezoneOptions}
              disabled={!isEditing}
              value={selectedTimezone || defaultOption}
              onChange={({ value }) => this.handleInputChange("time_zone", value)}
            />
          </div>
        </Panel>
        <DealershipMaintaniers maintainers={this.props.maintainers} />
        <IntegrationsPanel
          integrations={integrations}
          isSuperAdmin
          onAddIntegrationClick={this.openModal}
        />
      </>
    );
  }

  render() {
    return (
      <section className="conciergeDealershipDetailsPage">
        <PageHeader title={<PageTitle name={this.props.dealership.name} />} />
        <section className="conciergeDealershipDetailsMain">
          {this.renderContent()}
        </section>
        {this.state.isModalOpen && (
          <AddIntegrationModal
            excludedIntegrations={this.props.dealership.integrations.map(
              (i) => i.kind,
            )}
            dealershipId={this.state.dealershipId}
            onClose={this.closeModal}
          />
        )}
      </section>
    );
  }
}

DealershipDetailsPage.propTypes = {
  fetchDealershipDetails: func,
  match: matchType,
  isLoading: bool,
  maintainers: arrayOf({
    id: number,
    email: string,
  }).isRequired,
  /* eslint-disable react/forbid-prop-types */
  dealership: object,
  error: object,
  /* eslint-enable */
};

DealershipDetailsPage.defaultProps = {
  fetchDealershipDetails: null,
  isLoading: false,
  match: null,
  dealership: null,
  error: null,
};

const mapStateToProps = (state) => ({
  isLoading: dealershipDetailsLoadingStateSelector(state),
  dealership: dealershipDetailsDataSelector(state),
  maintainers: dealershipDetailsMaintainersSelector(state),
  error: dealershipDetailsErrorSelector(state),
});

const actions = {
  fetchDealershipDetails: retrieveDealershipDetails,
  updateDealershipInfo: changeDealershipInfo,
};

export default connect(mapStateToProps, actions)(DealershipDetailsPage);
