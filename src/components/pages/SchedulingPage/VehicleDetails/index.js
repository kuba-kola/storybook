import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { func, bool, string } from "prop-types";

import Block from "components/common/Block";
import { vehiclePropType, customerPropType } from "shared/prop-types";
import {
  setCurrentVehicle,
  setCurrentCustomer,
} from "store/actions/scheduling-process-actions";
import {
  schedulingCustomerSavingSelector,
  schedulingCustomerSavingErrorSelector,
} from "store/selectors/scheduling-selectors";
import {
  updateVehicleData,
  resetDataEditionState,
} from "store/actions/scheduling-actions";
import { updateVehicleFields } from "shared/fields";
import { imageUrl, isVehicleBookable } from "shared/utils/common";
import cx from "classnames";

import EditVehicleModal from "components/common/DataEditionModal/EditVehicleModal";
import Button from "components/common/Button";
import "../styles.scss";
import { dealershipMakeModelYearMapSelector } from "store/selectors/app-selectors";
import { settingsDefaultMakeSelector } from "store/selectors/settings-selectors";

const VehicleDetails = ({
  vehicle,
  dispatchCurrentVehicle,
  customer,
  dispatchCurrentCustomer,
  dataEditionModalSaving,
  dataEditionModalSavingError,
  updateVehicle,
  resetDataEditionModalState,
  makeModelYearMap,
  defaultMake,
}) => {
  const [vehicleEditorVisible, setVehicleEditorVisible] = useState(false);

  const dispatchCurrentInformation = () => {
    dispatchCurrentVehicle(vehicle);
    dispatchCurrentCustomer(customer);
  };

  const hideDataEditionModal = () => {
    resetDataEditionModalState();

    setVehicleEditorVisible(false);
  };

  const sendUpdateVehicleData = (data) => {
    const dataToSend = {
      ...data,
      id: vehicle.id,
    };

    updateVehicle(dataToSend);
  };

  return (
    <Block key={vehicle.id} className="conciergeSchedulingBlock">
      <section className="conciergeSchedulingVehicleDataHeader">
        <p>
          {vehicle?.vehicle_set?.model_year}
          {", "}
          {vehicle?.vehicle_set?.make}
          {" "}
          {vehicle?.vehicle_set?.model}
        </p>
        <Button
          variant="base-grey"
          icon="editGrey"
          onClick={() => setVehicleEditorVisible(true)}
        >
          <span>Edit</span>
        </Button>
      </section>
      <div className="conciergeSchedulingVehicleData">
        <div className="conciergeSchedulingVehicleDataContainer">
          {vehicle?.image?.url ? (
            <img
              className="conciergeSchedulingVehicleDataVehicleImage"
              src={imageUrl(vehicle.image)}
              alt=""
            />
          ) : (
            <p className="conciergeSchedulingVehicleDataNoImageText">
              No vehicle image
            </p>
          )}
        </div>
        <div className="conciergeSchedulingVehicleDataContainer">
          <div className="conciergeSchedulingVehicleDataSectionsContainer">
            <section className="conciergeSchedulingVehicleDataColumn">
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">Make</p>
                <p>{vehicle?.vehicle_set?.make}</p>
              </section>
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">Year</p>
                <p>{vehicle?.vehicle_set?.model_year}</p>
              </section>
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">Model</p>
                <p>{vehicle?.vehicle_set?.model}</p>
                {vehicle.appointment && (
                  <section className="conciergeSchedulingBookButtonSection">
                    <NavLink
                      to={{
                        pathname: `/bookings/${vehicle.appointment.guid}/${vehicle.appointment.kind}`,
                        search: `?dealershipId=${vehicle.appointment.dealership_id}`,
                      }}
                    >
                      <button
                        type="button"
                        className="conciergeSchedulingButton conciergeSchedulingBookedAppointmentButton"
                      >
                        {vehicle.appointment.appointment_datetime}
                        <span className="conciergeSchedulingBookedAppointmentCounter">
                          1
                        </span>
                      </button>
                    </NavLink>
                  </section>
                )}
              </section>
            </section>
          </div>
          <div className="conciergeSchedulingVehicleDataSectionsContainer">
            <section className="conciergeSchedulingVehicleDataColumn">
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">VIN</p>
                <p>{vehicle.vin}</p>
              </section>
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">Plate</p>
                <p>{vehicle.plate_number}</p>
              </section>
              <section className="conciergeSchedulingVehicleDataSection">
                <p className="conciergeSchedulingLabel">Mileage</p>
                <p>{vehicle.mileage}</p>
                <section className="conciergeSchedulingBookButtonSection">
                  <NavLink
                    style={{ textDecoration: "none" }}
                    to={{
                      pathname: "/scheduling/process",
                    }}
                  >
                    <Button
                      variant="brand"
                      fullWidth
                      onClick={() => dispatchCurrentInformation()}
                      disabled={!isVehicleBookable(vehicle)}
                    >
                      Book an appointment
                    </Button>
                  </NavLink>
                </section>
              </section>
            </section>
          </div>
        </div>
      </div>
      {vehicleEditorVisible && (
        <EditVehicleModal
          initialData={{
            mileage: vehicle.mileage,
            vin: vehicle.vin,
            external_model_code: vehicle.external_model_code,
            ...vehicle.vehicle_set,
          }}
          onClose={() => hideDataEditionModal()}
          title="Update vehicle"
          fields={updateVehicleFields}
          onSubmit={(data) => sendUpdateVehicleData(data)}
          submitButtonText="Update"
          loading={dataEditionModalSaving}
          error={dataEditionModalSavingError}
          makeModelYearMap={makeModelYearMap}
          defaultMake={defaultMake}
        />
      )}
    </Block>
  );
};

VehicleDetails.propTypes = {
  vehicle: vehiclePropType,
  customer: customerPropType,
  dispatchCurrentVehicle: func,
  dispatchCurrentCustomer: func,
  dataEditionModalSaving: bool.isRequired,
  dataEditionModalSavingError: string.isRequired,
  updateVehicle: func.isRequired,
  resetDataEditionModalState: func.isRequired,
  defaultMake: string,
};

VehicleDetails.defaultProps = {
  vehicle: null,
  customer: null,
  dispatchCurrentVehicle: null,
  dispatchCurrentCustomer: null,
  defaultMake: null,
};

const mapStateToProps = (state) => ({
  dataEditionModalSaving: schedulingCustomerSavingSelector(state),
  dataEditionModalSavingError: schedulingCustomerSavingErrorSelector(state),
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
  defaultMake: settingsDefaultMakeSelector(state),
});

const actions = {
  dispatchCurrentVehicle: setCurrentVehicle,
  dispatchCurrentCustomer: setCurrentCustomer,
  updateVehicle: updateVehicleData,
  resetDataEditionModalState: resetDataEditionState,
};

export default connect(mapStateToProps, actions)(VehicleDetails);
