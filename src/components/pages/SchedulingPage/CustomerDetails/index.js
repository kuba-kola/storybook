import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { func, bool, string } from "prop-types";

import Block from "components/common/Block";
import Panel from "components/common/Panel";
import { customerPropType } from "shared/prop-types";
import grayEditIcon from "assets/images/editGray.svg";
import { dmsTypeSelector, settingsDefaultMakeSelector } from "store/selectors/settings-selectors";
import {
  customerFieldsCDK,
  customerFieldsDT,
  vehicleFields,
} from "shared/fields";
import {
  resetDataEditionState,
  updateCustomerData,
  sendVehicleData,
} from "store/actions/scheduling-actions";
import {
  schedulingCustomerSavingSelector,
  schedulingCustomerSavingErrorSelector,
} from "store/selectors/scheduling-selectors";

import EditVehicleModal from "components/common/DataEditionModal/EditVehicleModal";
import DataEditionModal from "components/common/DataEditionModal";
import { dealershipMakeModelYearMapSelector } from "store/selectors/app-selectors";
import { prepareCustomerPickupAddress } from "shared/utils/common";
import VehicleDetails from "../VehicleDetails";
import "../styles.scss";

const CustomerDetails = ({
  customer,
  resetDataEditionModalState,
  dataEditionModalSaving,
  dataEditionModalSavingError,
  saveEditedCustomerData,
  saveVehicleData,
  dmsType,
  makeModelYearMap,
  defaultMake,
  focusOnInputField,
}) => {
  const [customerEditorVisible, setCustomerEditorVisible] = useState(false);
  const [vehicleEditorVisible, setVehicleEditorVisible] = useState(false);
  const [dataPassedToCustomerEditor, setDataPassedToCustomerEditor] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const vehiclesList = customer.vehicles.map((v) => (
    <VehicleDetails vehicle={v} customer={customer} key={v.id} />
  ));

  const vehiclesHeader = customer.vehicles.length ? (
    <p className="conciergeSchedulingBlockHeader">Vehicles</p>
  ) : null;

  useEffect(() => {
    const {
      first_name, last_name, phone_number, email, address,
    } = customer;

    setDataPassedToCustomerEditor({
      first_name,
      last_name,
      phone_number,
      email,
      address,
    });
  }, [customer]);

  const hideDataEditionModal = (modalType) => {
    resetDataEditionModalState();

    switch (modalType) {
      case "addVehicle":
        setVehicleEditorVisible(false);
        break;
      case "editCustomer":
        setCustomerEditorVisible(false);
        break;
      default:
        break;
    }
  };

  return (
    <Panel
      key={customer.id}
      className="conciergeSchedulingPanel"
      header={
        <p className="conciergeSchedulingSearchPanelHeader">Customer Details</p>
      }
    >
      <p className="conciergeSchedulingBlockHeader">Personal Data</p>
      <Block className="conciergeSchedulingBlock">
        <div className="conciergeSchedulingPersonalData">
          <div className="conciergeSchedulingPersonalDataSectionsContainer">
            <section className="conciergeSchedulingPersonalDataSection">
              <p className="conciergeSchedulingLabel">Full name</p>
              <p>
                {customer.first_name}
                {" "}
                {customer.last_name}
              </p>
            </section>
            <section className="conciergeSchedulingPersonalDataSection">
              <p className="conciergeSchedulingLabel">Email</p>
              <p>{customer.email}</p>
            </section>
          </div>
          <div className="conciergeSchedulingPersonalDataSectionsContainer">
            <section className="conciergeSchedulingPersonalDataSection">
              <p className="conciergeSchedulingLabel">Phone number</p>
              <p>{customer.phone_number}</p>
            </section>
            <button
              type="button"
              className="conciergeSchedulingPersonalDataEdit"
              onClick={() => setCustomerEditorVisible(true)}
            >
              <img
                className="conciergeSchedulingPersonalDataEditImage"
                alt="edit"
                src={grayEditIcon}
              />
              <span>Edit</span>
            </button>
          </div>
        </div>
        <div className="conciergeSchedulingPersonalData">
          <div className="conciergeSchedulingPersonalDataSectionsContainer">
            <section className="conciergeSchedulingPersonalDataSection">
              <p className="conciergeSchedulingLabel">Address</p>
              <p>{customer.address}</p>
            </section>
          </div>
        </div>
        {!!customer.last_address && !!customer.address_line1 && (
          <div className="conciergeSchedulingPersonalData">
            <div className="conciergeSchedulingPersonalDataSectionsContainer">
              <section className="conciergeSchedulingPersonalDataSection">
                <p className="conciergeSchedulingLabel">Pickup Address</p>
                <p>{prepareCustomerPickupAddress(customer)}</p>
              </section>
            </div>
          </div>
        )}
      </Block>
      {vehiclesHeader}
      {vehiclesList}
      <section className="conciergeSchedulingConfirmVehicleSection">
        <p>Vehicle not on the list? Please confirm with the customer if the vehicle could be linked to a different phone number.</p>
        <div className="conciergeSchedulingButtonGroup">
          <button
            type="button"
            className="conciergeSchedulingButton"
            onClick={() => focusOnInputField()}
          >
            Yes
          </button>
          <button
            type="button"
            className="conciergeSchedulingAddVehicleButton"
            onClick={() => setVehicleEditorVisible(true)}
          >
            No
          </button>
        </div>
      </section>
      {customerEditorVisible && (
        <DataEditionModal
          onClose={() => hideDataEditionModal("editCustomer")}
          title="Edit customer"
          fields={
            dmsType === "dealer_track" ? customerFieldsDT : customerFieldsCDK
          }
          onSubmit={(data) => saveEditedCustomerData(data, customer)}
          initialData={dataPassedToCustomerEditor}
          submitButtonText="Save"
          loading={dataEditionModalSaving}
          error={dataEditionModalSavingError}
        />
      )}
      {vehicleEditorVisible && (
        <EditVehicleModal
          onClose={() => hideDataEditionModal("addVehicle")}
          title="Add new vehicle"
          fields={vehicleFields}
          onSubmit={(data) => saveVehicleData(data, customer)}
          submitButtonText="Create"
          loading={dataEditionModalSaving}
          error={dataEditionModalSavingError}
          makeModelYearMap={makeModelYearMap}
          defaultMake={defaultMake}
        />
      )}
    </Panel>
  );
};

const mapStateToProps = (state) => ({
  dataEditionModalSaving: schedulingCustomerSavingSelector(state),
  dataEditionModalSavingError: schedulingCustomerSavingErrorSelector(state),
  dmsType: dmsTypeSelector(state),
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
  defaultMake: settingsDefaultMakeSelector(state),
});

const actions = {
  resetDataEditionModalState: resetDataEditionState,
  saveEditedCustomerData: updateCustomerData,
  saveVehicleData: sendVehicleData,
};

CustomerDetails.propTypes = {
  customer: customerPropType,
  resetDataEditionModalState: func.isRequired,
  dataEditionModalSaving: bool.isRequired,
  dataEditionModalSavingError: string.isRequired,
  saveEditedCustomerData: func.isRequired,
  saveVehicleData: func.isRequired,
  dmsType: string.isRequired,
};

CustomerDetails.defaultProps = {
  customer: null,
};

export default connect(mapStateToProps, actions)(CustomerDetails);
