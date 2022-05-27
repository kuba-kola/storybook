import React, { Component } from "react";
import ReactTimePicker from "react-time-picker";
import { connect } from "react-redux";
import {
  string, func, object, arrayOf,
} from "prop-types";
import { dealershipInfoPropType } from "shared/prop-types";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import CreatableSelect from "react-select/lib/Creatable";
import Switch from "react-switch";

import { changeDealershipInfo } from "store/actions/settings-actions";
import { dealershipIdSelector, dealershipMakeModelYearMapSelector, delershipOpCodeMapSelector } from "store/selectors/app-selectors";
import { weekDaysHumanFormat } from "shared/utils/datetime";
import { getAsyncImage, toSelectOption, convertArrayToSelectOptions } from "shared/utils/common";
import { emailValidator } from "shared/validators";

import Panel from "components/common/Panel";
import Block from "components/common/Block";
import Input from "components/common/Input";
import StyledSelect from "components/common/StyledSelect";
import ImageInput from "components/common/ImageInput";
import HeaderEdit from "components/common/HeaderEdit";

import "./styles.scss";

const NOTIFICATION_DELAY = 1000;
class GeneralPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      logo: null,
      welcome_screen: null,
      name: "",
      address: "",
      phone: "",
      email: "",
      tax_rate: "",
      manager_name: "",
      manager_phone: "",
      manager_email: "",
      sales_emails: [],
      additional_settings: {},
      working_hours: {},
      services_price_visible: false,
      repair_order_generation_on_arrival: true,
      car_inspection_enabled: true,
      logoForSending: null,
      welcomeScreenForSending: null,
      shouldDeleteWelcomeScreen: false,
      fallback_op_code: {},
      shouldDeleteLogo: false,
      salesEmailError: null,
      salesEmailInput: "",
      salesEmailsOptions: [],
    };
  }

  resetState = () => {
    const {
      logo,
      welcome_screen,
      name,
      address,
      fallback_op_code,
      phone,
      email,
      tax_rate,
      manager_name,
      manager_phone,
      manager_email,
      sales_emails,
      additional_settings,
      working_hours,
      services_price_visible,
      repair_order_generation_on_arrival,
      car_inspection_enabled,
    } = this.props.dealershipInfo;

    this.setState({
      logo,
      welcome_screen,
      name: name || "",
      address: address || "",
      fallback_op_code,
      phone: phone || "",
      email: email || "",
      tax_rate: tax_rate || "",
      manager_name: manager_name || "",
      manager_phone: manager_phone || "",
      manager_email: manager_email || "",
      sales_emails: convertArrayToSelectOptions(sales_emails) || [],
      additional_settings: additional_settings || {},
      working_hours: working_hours || {},
      services_price_visible: services_price_visible || false,
      repair_order_generation_on_arrival: repair_order_generation_on_arrival === undefined ? true : repair_order_generation_on_arrival,
      car_inspection_enabled: car_inspection_enabled,
      isEditing: false,
    });
  }

  componentDidMount() {
    this.resetState();
  }

  handleInputChange = (fieldName, value) => {
    if (this.state.isEditing) {
      this.setState({ [fieldName]: value });
    }
  }

  handleCreate = (inputValue) => {
    if (!emailValidator(inputValue)) {
      this.setState({ salesEmailError: "Invalid email" });
      return;
    }
    const { salesEmailsOptions, sales_emails } = this.state;
    const newOption = toSelectOption(inputValue);
    this.setState({
      salesEmailsOptions: [...salesEmailsOptions, newOption],
      sales_emails: [...sales_emails, newOption],
    });
  }

  handleWorkingHoursChange = (field, key, prefix, value) => {
    if (this.state.isEditing) {
      this.setState({ working_hours: { ...field, [key]: { ...field[key], [prefix]: value } } });
    }
  }

  handleAdditionalSettingsChange = (field, key, value) => {
    if (this.state.isEditing) {
      this.setState({ additional_settings: { ...field, [key]: value } });
    }
  }

  handleFallbackOpCodeChange = (value, label) => {
    if (this.state.isEditing) {
      this.setState({
        fallback_op_code: { id: value, operation_code: label },
      });
    }
  }

  handleLogoChange = (e) => {
    const logo = e.target.files[0];
    const logoUrl = URL.createObjectURL(logo);
    this.setState({
      logoForSending: logo,
      logo: { url: logoUrl },
      shouldDeleteLogo: false,
    });
    NotificationManager.success("New logo was successfully uploaded. Don't forget to save it.", "Success", NOTIFICATION_DELAY);
  }

  handleImageChange = (e) => {
    const image = e.target.files[0];
    const imageUrl = URL.createObjectURL(image);

    getAsyncImage(imageUrl)
      .then((img) => {
        if (img.naturalWidth < 1080 || img.naturalHeight < 1920) {
          NotificationManager.warning("The minimum size requirements for the  image is 1080x1920 pixels.", "Warning", NOTIFICATION_DELAY);
          return;
        }
        this.setState({
          welcomeScreenForSending: image,
          welcome_screen: { url: imageUrl },
          shouldDeleteWelcomeScreen: false,
        });
        NotificationManager.success("New image was successfully uploaded. Don't forget to save it.", "Success", NOTIFICATION_DELAY);
      });
  }

  handleDeletingLogo = () => this.setState({
    logo: null,
    logoForSending: null,
    shouldDeleteLogo: true,
  });

  handleDeletingWelcomeScreen = () => this.setState({
    welcome_screen: null,
    welcomeScreenForSending: null,
    shouldDeleteWelcomeScreen: true,
  });

  enableEditing = () => this.setState({ isEditing: true })

  saveChanges = () => {
    const { updateDealershipInfo, dealershipId } = this.props;
    const {
      name,
      address,
      phone,
      email,
      tax_rate,
      manager_name,
      manager_phone,
      manager_email,
      sales_emails,
      working_hours,
      fallback_op_code,
      additional_settings,
      services_price_visible,
      repair_order_generation_on_arrival,
      car_inspection_enabled,
      logoForSending,
      welcomeScreenForSending,
      shouldDeleteWelcomeScreen,
      shouldDeleteLogo,
    } = this.state;
    const dataToSend = new FormData();
    dataToSend.append("name", name);
    dataToSend.append("address", address);
    dataToSend.append("phone", phone);
    dataToSend.append("email", email);
    dataToSend.append("tax_rate", tax_rate);
    dataToSend.append("manager_name", manager_name);
    dataToSend.append("manager_phone", manager_phone);
    dataToSend.append("manager_email", manager_email);
    if (fallback_op_code !== null && fallback_op_code.id !== null) {
      dataToSend.append("fallback_op_code_id", fallback_op_code.id);
    }
    sales_emails.length
      ? sales_emails.map((email) => email.value && dataToSend.append("sales_emails[]", email.value))
      : dataToSend.append("sales_emails[]", "");
    dataToSend.append("additional_settings", JSON.stringify(additional_settings));
    dataToSend.append("working_hours", JSON.stringify(working_hours));
    dataToSend.append("services_price_visible", services_price_visible);
    dataToSend.append("repair_order_generation_on_arrival", repair_order_generation_on_arrival);
    dataToSend.append("car_inspection_enabled", car_inspection_enabled);
    dataToSend.append("time_zone", this.props.dealershipInfo.time_zone);

    if (logoForSending) {
      dataToSend.append("logo", logoForSending);
    } else if (shouldDeleteLogo) {
      dataToSend.append("remove_logo", true);
    }
    if (welcomeScreenForSending) {
      dataToSend.append("welcome_screen", welcomeScreenForSending);
    } else if (shouldDeleteWelcomeScreen) {
      dataToSend.append("remove_welcome_screen", true);
    }
    updateDealershipInfo(dealershipId, dataToSend);
    this.setState({ isEditing: false });
  }

  render() {
    const {
      isEditing,
      logo,
      welcome_screen,
      name,
      address,
      phone,
      email,
      tax_rate,
      manager_name,
      manager_phone,
      manager_email,
      working_hours,
      sales_emails,
      additional_settings,
      fallback_op_code,
      services_price_visible,
      repair_order_generation_on_arrival,
      car_inspection_enabled,
      salesEmailError,
      salesEmailInput,
      salesEmailsOptions,
    } = this.state;
    const { makeModelYearMap, opCodeMap } = this.props;
    const structuredOpCodes = opCodeMap ? [{ label: "NONE", value: null }].concat(opCodeMap.map((opCode) => ({ label: opCode.operation_code, value: opCode.id }))) : [];
    const structuredMakes = makeModelYearMap ? convertArrayToSelectOptions(Object.keys(makeModelYearMap)) : [];
    return (
      <Panel
        header={(
          <HeaderEdit
            isEditing={isEditing}
            handleCancel={this.resetState}
            handleEdit={this.enableEditing}
            handleSave={this.saveChanges}
          />
        )}
        className="conciergeSettingsPageGeneralPanel"
      >
        <NotificationContainer />
        <Block
          title="Dealership details"
          className="conciergeSettingsPageBlock conciergeSettingsPageGeneralBlock"
        >
          <ImageInput
            onImageChange={this.handleLogoChange}
            onDelete={this.handleDeletingLogo}
            isEditing={isEditing}
            inputName="logoInput"
            image={logo}
            alt="concierge dealership logo"
            imagePresentText="Upload Logo"
            noImageText="No Logo"
          />
          <ImageInput
            onImageChange={this.handleImageChange}
            onDelete={this.handleDeletingWelcomeScreen}
            isEditing={isEditing}
            inputName="imageInput"
            image={welcome_screen}
            alt="concierge dealership welcome screen"
            imagePresentText="Upload Welcome Screen Image"
            noImageText="No Welcome Screen Image"
          />
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
            label="Phone number"
            type="tel"
            value={phone}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("phone", value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("email", value)}
          />
          <div className="salesEmailsSelectWrapper">
            <div className="salesEmailsSelectLabel">Sales Emails</div>
            <CreatableSelect
              components={{
                DropdownIndicator: null,
              }}
              isMulti
              inputValue={salesEmailInput}
              onInputChange={(value) => {
                this.setState({ salesEmailError: null });
                this.handleInputChange("salesEmailInput", value);
              }}
              onChange={(value) => {
                this.setState({
                  salesEmailsOptions: value,
                  sales_emails: value,
                  salesEmailError: null,
                });
              }}
              onCreateOption={this.handleCreate}
              isDisabled={!isEditing}
              placeholder="Type in the email and press enter..."
              classNamePrefix="salesEmailsSelect"
              className="salesEmailsSelectContainer"
              options={salesEmailsOptions}
              value={sales_emails}
            />
            {salesEmailError && <div className="salesEmailsSelectError">{salesEmailError}</div>}
          </div>
          <Input
            label="Tax Rate"
            type="number"
            value={tax_rate}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("tax_rate", value)}
          />
          <div className="SwitchContainer">
            <label className="conciergeInputLabel" htmlFor="services-price-visible">Services price visible</label>
            <Switch
              id="services-price-visible"
              className="Switch"
              onChange={() => this.handleInputChange("services_price_visible", !services_price_visible)}
              disabled={!isEditing}
              checked={services_price_visible}
              onColor="#36af5e"
              offColor="#dedee0"
              activeBoxShadow="0 0 2px 3px #0bcaf9"
              aria-labelledby="services-price-visible-label"
            />
          </div>
          <div className="SwitchContainer">
            <label className="conciergeInputLabel" htmlFor="autogenerate-ro-visible-visible">Auto-generate RO</label>
            <Switch
              id="autogenerate-ro-visible"
              className="Switch"
              onChange={() => this.handleInputChange("repair_order_generation_on_arrival", !repair_order_generation_on_arrival)}
              disabled={!isEditing}
              checked={repair_order_generation_on_arrival}
              onColor="#36af5e"
              offColor="#dedee0"
              activeBoxShadow="0 0 2px 3px #0bcaf9"
              aria-labelledby="autogenerate-ro-visible-visible-label"
            />
          </div>
          <div className="SwitchContainer">
            <label className="conciergeInputLabel" htmlFor="car-inspection-visible">Car inspection</label>
            <Switch
              id="car-inspection-visible"
              className="Switch"
              onChange={() => this.handleInputChange("car_inspection_enabled", !car_inspection_enabled)}
              disabled={!isEditing}
              checked={car_inspection_enabled}
              onColor="#36af5e"
              offColor="#dedee0"
              activeBoxShadow="0 0 2px 3px #0bcaf9"
              aria-labelledby="car-inspection-visible-visible-label"
            />
          </div>
        </Block>
        <Block
          title="Service Manager"
          className="conciergeSettingsPageBlock conciergeSettingsPageGeneralBlock"
        >
          <Input
            label="Name"
            type="text"
            value={manager_name}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("manager_name", value)}
          />
          <Input
            label="Phone"
            type="tel"
            value={manager_phone}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("manager_phone", value)}
          />
          <Input
            label="Email"
            type="email"
            value={manager_email}
            disabled={!isEditing}
            onChange={(value) => this.handleInputChange("manager_email", value)}
          />
        </Block>
        <Block
          title="Working Hours"
          className="conciergeSettingsPageBlock conciergeSettingsPageGeneralBlock"
        >
          {Object.keys(working_hours).map((keyName) => (
            <div className="conciergeDealershipTimeField">
              <div className="conciergeDealershipTimeFieldLabel">
                {weekDaysHumanFormat(keyName)}
              </div>
              <div className="conciergeDealershipTimeFieldBlock">
                <ReactTimePicker
                  label="from"
                  value={working_hours[keyName].from}
                  disabled={!isEditing}
                  onChange={(value) => this.handleWorkingHoursChange(working_hours, keyName, "from", value)}
                  key={`${keyName}_from`}
                  className="conciergeDealershipTimeFieldInput"
                  disableClock
                  format="hh:mma"
                />
                <ReactTimePicker
                  label="to"
                  value={working_hours[keyName].to}
                  disabled={!isEditing}
                  onChange={(value) => this.handleWorkingHoursChange(working_hours, keyName, "to", value)}
                  key={`${keyName}_to`}
                  className="conciergeDealershipTimeFieldInput"
                  disableClock
                  format="hh:mma"
                />
              </div>
            </div>
          ))}
        </Block>
        <div className="conciergeSettingsPageDealerBrand">
          <Block
            title="Dealer Brand"
            className="conciergeSettingsPageBlock "
          >
            <label
              htmlFor="default_make"
              id="default_make"
              key="default_make"
              className="dataEditionModalLabel"
            >
              <span>Make</span>
              <StyledSelect
                value={{
                  label: additional_settings.default_make,
                  value: additional_settings.default_make,
                }}
                options={structuredMakes}
                className="dataEditionModalSelect"
                disabled={!isEditing}
                onChange={({ value }) => this.handleAdditionalSettingsChange(additional_settings, "default_make", value)}
              />
            </label>
            <Input
              label="Dealer code"
              type="dealer_code"
              value={additional_settings.dealer_code}
              disabled={!isEditing}
              onChange={(value) => this.handleAdditionalSettingsChange(additional_settings, "dealer_code", value)}
            />
          </Block>
          <Block
            title="Fallback OP Code"
            className="conciergeSettingsPageBlock "
          >
            <label
              htmlFor="fallback_op_code"
              id="fallback_op_code"
              key="fallback_op_code"
              className="dataEditionModalLabel"
            >
              <span>Fallback OP Code</span>
              <StyledSelect
                value={{
                  label: fallback_op_code?.operation_code,
                  value: fallback_op_code?.id,
                }}
                options={structuredOpCodes}
                className="dataEditionModalSelect"
                disabled={!isEditing}
                onChange={({ value, label }) => this.handleFallbackOpCodeChange(value, label)}
              />
            </label>
          </Block>
        </div>
      </Panel>
    );
  }
}

GeneralPanel.propTypes = {
  dealershipInfo: dealershipInfoPropType,
  dealershipId: string,
  updateDealershipInfo: func,
  makeModelYearMap: object,
  opCodeMap: arrayOf(object),
};

GeneralPanel.defaultProps = {
  dealershipInfo: null,
  dealershipId: null,
  updateDealershipInfo: null,
  opCodeMap: null,
};

const mapStateToProps = (state) => ({
  dealershipId: dealershipIdSelector(state),
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
  opCodeMap: delershipOpCodeMapSelector(state),
});

const actions = {
  updateDealershipInfo: changeDealershipInfo,
};

export default connect(mapStateToProps, actions)(GeneralPanel);
