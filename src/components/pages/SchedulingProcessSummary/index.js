import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import {
  arrayOf, bool, func, string,
} from "prop-types";
import { isEmpty } from "ramda";

import {
  schedulingCurrentVehicleSelector,
  schedulingCurrentCustomerSelector,
  schedulingSelectedServicesSelector,
  schedulingChosenTimeSlotSelector,
  schedulingClientWaitingSelector,
  schedulingSelectedTransportSelector,
  schedulingSaveAppointmentLoadingSelector,
  schedulingSaveAppointmentLoadingErrorSelector,
  schedulingSelectedRecallsSelector,
} from "store/selectors/scheduling-process-selectors";
import {
  vehiclePropType,
  customerPropType,
  servicePropType,
  chosenTimeSlotPropType,
} from "shared/prop-types";
import { bookAppointment } from "store/actions/scheduling-process-actions";

import PageHeader from "components/common/PageHeader";
import Panel from "components/common/Panel";

import VehicleClientBlock from "./VehicleClientBlock";
import AppointmentSummary from "./AppointmentSummary";

import "./styles.scss";

const PageTitle = () => <h2>Scheduling</h2>;

const SchedulingProcessSummary = ({
  vehicle,
  customer,
  services,
  time,
  clientWaiting,
  selectedTransport,
  bookNewAppointment,
  saveAppointmentLoading,
  saveAppointmentLoadingError,
}) => {
  useEffect(() => {
    if (services.length && !isEmpty(time)) {
      bookNewAppointment();
    }
  }, []);

  if (!services.length) {
    return (
      <Redirect
        to={{
          pathname: "/scheduling/process",
        }}
      />
    );
  }

  if (saveAppointmentLoading) {
    return <Panel className="schedulingProcessSummaryLoadingPanel">Loading...</Panel>;
  }

  return (
    <>
      <section className="conciergeBookingDetailsPage">
        <section className="conciergeSchedulingHeaderSection">
          <PageHeader title={<PageTitle />} />
        </section>
        {
          saveAppointmentLoadingError
            ? (
              <>
                <div className="schedulingProcessSummaryBar schedulingProcessSummaryBarRed font-lato">
                  {!!Array.isArray(saveAppointmentLoadingError) && (
                    saveAppointmentLoadingError.map((error) => error.message)
                  )}
                  {saveAppointmentLoadingError.message}
                </div>
                <section className="schedulingProcessSummaryContainer schedulingProcessSummaryContainerNoVehicle">
                  <NavLink
                    to={{
                      pathname: "/scheduling/process",
                    }}
                  >
                    <button type="button" className="conciergeSchedulingButton conciergeSchedulingBookButton">
                      Back
                    </button>
                  </NavLink>
                </section>
              </>
            )
            : (
              <>
                <div className="schedulingProcessSummaryBar schedulingProcessSummaryBarGreen font-lato">
                  New appointment has been successfully booked!
                </div>
                <section className="schedulingProcessSummaryContainer">
                  <section className="schedulingProcessSummaryChoicePanel">
                    <VehicleClientBlock customer={customer} vehicle={vehicle} time={time} />
                  </section>
                  <AppointmentSummary
                    services={services}
                    clientWaiting={clientWaiting}
                    selectedTransport={selectedTransport}
                  />
                </section>
              </>
            )
        }
      </section>
    </>
  );
};

const mapStateToProps = (state) => ({
  vehicle: schedulingCurrentVehicleSelector(state),
  customer: schedulingCurrentCustomerSelector(state),
  services: [...schedulingSelectedServicesSelector(state), ...schedulingSelectedRecallsSelector(state)],
  time: schedulingChosenTimeSlotSelector(state),
  clientWaiting: schedulingClientWaitingSelector(state),
  selectedTransport: schedulingSelectedTransportSelector(state),
  saveAppointmentLoading: schedulingSaveAppointmentLoadingSelector(state),
  saveAppointmentLoadingError: schedulingSaveAppointmentLoadingErrorSelector(state),
});

const actions = {
  bookNewAppointment: bookAppointment,
};

SchedulingProcessSummary.propTypes = {
  vehicle: vehiclePropType.isRequired,
  customer: customerPropType.isRequired,
  services: arrayOf(servicePropType).isRequired,
  time: chosenTimeSlotPropType.isRequired,
  clientWaiting: bool.isRequired,
  selectedTransport: string.isRequired,
  bookNewAppointment: func.isRequired,
  saveAppointmentLoading: bool.isRequired,
  saveAppointmentLoadingError: string.isRequired,
};

export default connect(mapStateToProps, actions)(SchedulingProcessSummary);
