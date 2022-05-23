import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  arrayOf, bool, number, object, func,
} from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { isEmpty } from "ramda";
import Switch from "react-switch";

import Accordion from "components/common/Accordion/SchedulingAccordion";
import {
  schedulingCurrentVehicleSelector,
  schedulingSelectedServicesSelector,
  schedulingChosenTimeSlotSelector,
  schedulingSelectedAdvisorSelector,
  schedulingProcessSendSmsSelector,
  schedulingProcessContactNumberSelector,
  schedulingIsRemoteSelector,
  schedulingCurrentCustomerSelector,
  schedulingSelectedRecallsSelector,
} from "store/selectors/scheduling-process-selectors";
import {
  setIsRemote,
} from "store/actions/scheduling-process-actions";
import { countSelectedServicesByType, prepareCustomerPickupAddress, prepareCustomerPickupAddressData } from "shared/utils/common";
import {
  vehiclePropType,
  servicePropType,
  chosenTimeSlotPropType,
  serviceAdvisorPropType,
} from "shared/prop-types";
import {
  BOOKING_STEP_SERVICES,
  BOOKING_STEP_RECALLS,
  BOOKING_STEP_ADVISOR,
  BOOKING_STEP_TIMESLOT,
  BOOKING_STEP_COMMUNICATION,
  BOOKING_STEP_TRANSPORT,
  BOOKING_STEP_REMOTE,
} from "shared/constants";

import AppointmentDetails from "components/common/AppointmentDetails/AppointmentDetailsScheduling";
import ChooseServices from "components/common/BookingSteps/ChooseServices/ChooseServicesScheduling";
import TimeOfArrival from "components/common/BookingSteps/TimeOfArrival/TimeOfArrivalScheduling";
import ChooseAdvisor from "components/common/BookingSteps/ChooseAdvisor/ChooseAdvisorScheduling";
import Transportation from "components/common/BookingSteps/Transportation/TransportationScheduling";
import PageHeader from "components/common/PageHeader";
import ChooseRecalls from "./ChooseRecalls";
import Communication from "./Communication";
import ChooseRemote from "./ChooseRemote";

import "./styles.scss";

const PageTitle = () => <h2>Scheduling</h2>;

const SchedulingProcessPage = ({
  vehicle: { vehicle_set },
  selectedServices,
  selectedRecalls,
  chosenTimeSlot,
  selectedAdvisor,
  smsConsent,
  contactNumber,
  isRemote,
  schedulingRemote,
  history,
  currentCustomer,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatTimeInfo = () => {
    const { day: { day_name, day_of_month }, quarterSlot } = chosenTimeSlot;
    return `${day_name}, ${day_of_month}, ${quarterSlot}`;
  };

  return (
    <section className="conciergeSchedulingPage">
      <section className="conciergeSchedulingHeaderSection">
        <PageHeader title={<PageTitle />} />
      </section>
      {vehicle_set
        ? (
          <section className="schedulingProcessContainer">
            <section className="schedulingProcessChoicePanel">
              <Accordion
                title="Choose services"
                concernCount={countSelectedServicesByType("concern", selectedServices)}
                maintenanceCount={countSelectedServicesByType("maintenance", selectedServices)}
                customClass="schedulingProcessAccordion"
                step={BOOKING_STEP_SERVICES}
              >
                <ChooseServices nextStep={BOOKING_STEP_RECALLS} isScheduler />
              </Accordion>
              <Accordion
                title="Recalls"
                customClass="schedulingProcessAccordion"
                step={BOOKING_STEP_RECALLS}
              >
                <ChooseRecalls />
              </Accordion>
              <div className="schedulingPickupSwitchContainer">
                <label className="conciergeInputLabel" htmlFor="scheduling-pickup-switch">Customer needs Pick-up</label>
                <Switch
                  id="scheduling-pickup-switch"
                  className="schedulingPickupSwitch"
                  onChange={() => schedulingRemote(!isRemote)}
                  checked={isRemote}
                  onColor="#36af5e"
                  offColor="#dedee0"
                  activeBoxShadow="0 0 2px 3px #0bcaf9"
                  aria-labelledby="scheduling-pickup-label"
                />
              </div>
              <Accordion
                title="Service Advisor"
                step={BOOKING_STEP_ADVISOR}
                selectedValue={selectedAdvisor && selectedAdvisor.name}
                customClass="schedulingProcessAccordion"
              >
                <ChooseAdvisor />
              </Accordion>
              <Accordion
                title={`Time of ${isRemote ? "Pickup" : "Arrival"}`}
                customClass="schedulingProcessAccordion"
                selectedValue={!isEmpty(chosenTimeSlot) && formatTimeInfo()}
                step={BOOKING_STEP_TIMESLOT}
              >
                <TimeOfArrival
                  selectedAdvisor={selectedAdvisor}
                  nextStep={BOOKING_STEP_COMMUNICATION}
                />
              </Accordion>
              <Accordion
                title="Communication"
                customClass="schedulingProcessAccordion"
                selectedValue={smsConsent === true ? contactNumber : "No SMS"}
                step={BOOKING_STEP_COMMUNICATION}
              >
                <Communication isRemote={isRemote} />
              </Accordion>
              {isRemote ? (
                <Accordion
                  title="Remote"
                  customClass="schedulingProcessAccordion"
                  step={BOOKING_STEP_REMOTE}
                >
                  <ChooseRemote
                    chosenTimeSlot={chosenTimeSlot}
                    customerPickupAddress={prepareCustomerPickupAddress(currentCustomer)}
                    customerPickupAddressData={prepareCustomerPickupAddressData(currentCustomer)}
                  />
                </Accordion>
              ) : (
                <Accordion
                  title="Transportation"
                  step={BOOKING_STEP_TRANSPORT}
                >
                  <Transportation />
                </Accordion>
              )}

            </section>
            <Accordion
              expandable={false}
              title={isRemote ? "Pickup details" : "Appointment details"}
              customClass="schedulingProcessAppointmentDetailsAccordion"
            >
              <AppointmentDetails
                saveButtonLabel={isRemote ? "Book a pickup" : "Book appointment"}
                onSave={() => {
                  const isCommunicationComplete = (smsConsent && contactNumber) || !smsConsent;
                  const isAppointmentComplete = [...selectedServices, ...selectedRecalls].length && chosenTimeSlot.quarterSlot && isCommunicationComplete;

                  history.push(`/scheduling/${isAppointmentComplete ? "summary" : "process"}`);
                }}
              />
            </Accordion>
          </section>
        )
        : (
          <>
            <div className="schedulingProcessBar schedulingProcessBarRed font-lato">
              Please choose vehicle again
            </div>
            <section className="schedulingProcessSummaryContainer schedulingProcessSummaryContainerNoVehicle">
              <NavLink
                to={{
                  pathname: "/scheduling",
                }}
              >
                <button type="button" className="conciergeSchedulingButton conciergeSchedulingBookButton">
                  Back
                </button>
              </NavLink>
            </section>
          </>
        )}
    </section>
  );
};

const mapStateToProps = (state) => ({
  vehicle: schedulingCurrentVehicleSelector(state),
  selectedServices: schedulingSelectedServicesSelector(state),
  selectedRecalls: schedulingSelectedRecallsSelector(state),
  chosenTimeSlot: schedulingChosenTimeSlotSelector(state),
  selectedAdvisor: schedulingSelectedAdvisorSelector(state),
  smsConsent: schedulingProcessSendSmsSelector(state),
  contactNumber: schedulingProcessContactNumberSelector(state),
  currentCustomer: schedulingCurrentCustomerSelector(state),
  isRemote: schedulingIsRemoteSelector(state),
});

const actions = {
  schedulingRemote: setIsRemote,
};

SchedulingProcessPage.propTypes = {
  vehicle: vehiclePropType,
  selectedServices: arrayOf(servicePropType),
  chosenTimeSlot: chosenTimeSlotPropType,
  selectedAdvisor: serviceAdvisorPropType,
  smsConsent: bool.isRequired,
  contactNumber: number.isRequired,
  isRemote: bool.isRequired,
  schedulingRemote: func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: object.isRequired,
};

SchedulingProcessPage.defaultProps = {
  vehicle: {},
  selectedServices: [],
  chosenTimeSlot: {},
  selectedAdvisor: {},
};

const SchedulingProcessPageWithRouter = withRouter(SchedulingProcessPage);

export default connect(mapStateToProps, actions)(SchedulingProcessPageWithRouter);
