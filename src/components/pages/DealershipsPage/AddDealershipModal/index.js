import React, { Component } from "react";
import { func, string, array } from "prop-types";
import { connect } from "react-redux";
import { isEmpty, isNil, reject } from "ramda";
import { addDealership } from "store/actions/dealerships-actions";
import { authTokenSelector } from "store/selectors/auth-selectors";
import { dealershipsDataSelector } from "store/selectors/dealerships-selectors";
import { availableTimezones } from "shared/utils/datetime";
import { emailValidator } from "shared/validators";
import StyledSelect from "components/common/StyledSelect";
import Input from "components/common/Input";
import Modal from "components/common/Modal";

import "./styles.scss";

class AddDealershipModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      timezone: "",
      email: "",
      taxRate: "",
      errors: {},
    };
  }

  submit = () => {
    if (this.validate(this.state)) {
      const dealershipParams = {
        dealership: {
          name: this.state.name,
          address: this.state.address,
          time_zone: this.state.timezone,
          tax_rate: this.state.taxRate,
        },
        dealership_admin: {
          email: this.state.email,
        },
      };
      this.props.onSubmit(dealershipParams, this.props.token);
      this.props.onClose();
    }
  }

  validate = (dealershipData) => {
    const { errors } = this.state;
    errors.name = this.nameBlankError(dealershipData.name)
      || this.nameNonUniqError(dealershipData.name);
    errors.address = this.addressBlankError(dealershipData.address);
    errors.timezone = this.timezoneBlankError(dealershipData.timezone);
    errors.email = this.emailBlankError(dealershipData.email)
      || this.emailInvalidFormatError(dealershipData.email);
    errors.taxRate = this.taxRateBlankError(dealershipData.taxRate)
      || this.taxRateNotNumberError(dealershipData.taxRate);
    this.setState({ errors });
    return isEmpty(reject(isNil, Object.values(errors)));
  };

  nameBlankError = (name) => (isEmpty(name) ? "Dealership's name can't be blank." : null);

  nameNonUniqError = (name) => (
    this.props.dealerships.every((dealership) => (
      dealership.name !== name
    )) ? null : "Dealership's name has already been taken."
  );

  addressBlankError = (address) => (isEmpty(address) ? "Dealership's address can't be blank." : null);

  timezoneBlankError = (timezone) => (
    isEmpty(timezone) ? "Dealership's timezone can't be blank." : null
  );

  emailBlankError = (email) => (isEmpty(email) ? "Dealership admin's email can't be blank." : null);

  emailInvalidFormatError = (email) => (
    isEmpty(email) || emailValidator(email) ? null : "Dealership admin's email is not valid email address."
  );

  taxRateBlankError = (taxRate) => (
    isEmpty(taxRate) ? "Dealership's tax rate can't be blank." : null
  );

  /* eslint-disable no-restricted-globals */
  taxRateNotNumberError = (taxRate) => (
    isNaN(taxRate) ? "Dealership's tax rate is not a number." : null
  );
  /* eslint-enable no-restricted-globals */

  handleNameChange = (name) => (
    this.setState(({ errors }) => ({ name, errors: { ...errors, name: null } }))
  );

  handleAddressChange = (address) => (
    this.setState(({ errors }) => ({ address, errors: { ...errors, address: null } }))
  );

  handleTimeZoneChange = (timezoneOption) => {
    const newState = timezoneOption.value !== ""
      ? { timezone: timezoneOption.value, errors: { ...this.state.errors, timezone: null } }
      : { timezone: timezoneOption.value };
    this.setState(newState);
  }

  handleEmailChange = (email) => (
    this.setState(({ errors }) => ({ email, errors: { ...errors, email: null } }))
  );

  handleTaxRateChange = (taxRate) => (
    this.setState(({ errors }) => ({ taxRate, errors: { ...errors, taxRate: null } }))
  );

  render() {
    const {
      name,
      address,
      timezone,
      email,
      taxRate,
      errors,
    } = this.state;
    const preparedTimezoneOptions = availableTimezones().map((availableTimezone) => (
      { label: availableTimezone, value: availableTimezone }
    ));
    const defaultOption = { label: "", value: "" };
    const selectedTimezone = preparedTimezoneOptions.find((timezoneOption) => (
      timezoneOption.value === timezone
    ));
    const timezoneOptions = selectedTimezone
      ? preparedTimezoneOptions : [defaultOption, ...preparedTimezoneOptions];

    return (
      <Modal
        title="New dealership"
        cancelButtonText="Cancel"
        submitButtonText="Create"
        size="small"
        onCancel={this.props.onClose}
        onSubmit={this.submit}
      >
        <div className="addDealershipModalInputContainer">
          <Input
            inputClassName="addDealershipModalInput"
            label="Dealership&apos;s name"
            value={name}
            onChange={this.handleNameChange}
            error={errors.name}
          />
        </div>
        <div className="addDealershipModalInputContainer">
          <div className="addDealershipModalInputContainerSelectWrapper">
            <div className="addDealershipModalLabel">
              Dealership&apos;s  timezone
            </div>
            <StyledSelect
              className="addDealershipModalSelect"
              key="dealership_timezone"
              options={timezoneOptions}
              value={selectedTimezone || defaultOption}
              onChange={this.handleTimeZoneChange}
              error={errors.timezone}
            />
          </div>
        </div>
        <div className="addDealershipModalInputContainer">
          <Input
            inputClassName="addDealershipModalInput"
            label="Dealership&apos;s address"
            value={address}
            onChange={this.handleAddressChange}
            error={errors.address}
          />
        </div>
        <div className="addDealershipModalInputContainer">
          <Input
            inputClassName="addDealershipModalInput"
            label="Dealership admin&apos;s email"
            value={email}
            onChange={this.handleEmailChange}
            error={errors.email}
          />
        </div>
        <div className="addDealershipModalInputContainer">
          <Input
            inputClassName="addDealershipModalInput"
            label="Dealership&apos;s tax rate"
            value={taxRate}
            onChange={this.handleTaxRateChange}
            error={errors.taxRate}
          />
        </div>
      </Modal>
    );
  }
}

AddDealershipModal.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  token: string.isRequired,
  dealerships: array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => ({
  token: authTokenSelector(state),
  dealerships: dealershipsDataSelector(state),
});

const actions = { onSubmit: addDealership };

export default connect(mapStateToProps, actions)(AddDealershipModal);
