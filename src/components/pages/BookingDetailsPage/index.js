import React, { Component } from "react";
import { match as matchType } from "react-router-prop-types";
import {
  string,
  func,
  bool,
  object,
  oneOfType,
  number,
  arrayOf,
} from "prop-types";
import cx from "classnames";
import {
  servicePropType,
  chosenTimeSlotPropType,
  serviceAdvisorPropType,
} from "shared/prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { isEmpty, isNil, or } from "ramda";
import { NotificationContainer, NotificationManager } from "react-notifications";

import BookingDetailsPanel from "components/pages/BookingDetailsPage/BookingDetailsPanel";
import AlternativeTransportationPanel from "components/pages/BookingDetailsPage/AlternativeTransportationPanel";
import RemotePanel from "components/pages/BookingDetailsPage/RemotePanel";
import BookingDetailsSummary from "components/pages/BookingDetailsPage/BookingDetailsSummary";
import VideosPanel from "components/pages/BookingDetailsPage/VideosPanel";

import PageHeader from "components/common/PageHeader";
import Panel from "components/common/Panel";
import Accordion from "components/common/Accordion/BookingAccordion";
import Modal from "components/common/Modal";
import UncheckedIcon from "assets/images/bookings/unchecked.svg";
import CheckedIcon from "assets/images/bookings/checked.svg";
import loadingGif from "assets/images/loading.gif";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { appCheckinIdSelector } from "store/selectors/checkin-app-selectors";
import {
  bookingDetailsDataSelector,
  bookingDetailsLoadingStateSelector,
  bookingDetailsErrorSelector,
  bookingDetailsChosenTimeSlotSelector,
  bookingDetailsSelectedAdvisorSelector,
  bookingDetailsSaveAppointmentLoadingSelector,
  bookingDetailsSaveAppointmentErrorSelector,
  bookingDetailsSelectedServicesSelector,
  bookingDetailsIsRemoteSelector,
  bookingDetailsIsCheckedInSelector,
  bookingDetailsIsTriggerSmsLoadingSelector,
  bookingDetailsIsSmsSentSelector,
  bookingDetailsUpdatedWithoutDmsNotificationSelector,
  bookingDetailsSendSmsSelector,
  bookingDetailsIsROGeneratedSelector,
  bookingSelectedRecallsSelector,
} from "store/selectors/booking-details-selectors";
import {
  retrieveBookingDetails,
  deleteBooking,
  updateAppointment,
  triggerCheckinSms,
  resetBookingDetails,
  scheduleNewBooking,
  setSendSms,
  generateRO,
} from "store/actions/booking-details-actions";
import {
  importAppointmentByGuid,
  initializeChat,
  initializeCheckIn,
} from "store/actions/checkin-chat-actions";
import { exit } from "store/actions/checkin-app-actions";
import {
  chatIsInitializedSelector,
  checkinAppointmentErrorSelector,
  checkinAppointmentLoadingSelector,
} from "store/selectors/checkin-chat-selectors";
import {
  settingsIsAutoGenerateROSelector,
} from "store/selectors/settings-selectors";

import { countSelectedServicesByType } from "shared/utils/common";
import { isMobileAndTablet } from "shared/utils/index";

import {
  BOOKING_STEP_RECALLS,
  BOOKING_STEP_SERVICES,
  BOOKING_STEP_ADVISOR,
  BOOKING_STEP_TIMESLOT,
  BOOKING_STEP_TRANSPORT,
} from "shared/constants";

import ArrowLeft from "assets/images/arrow/left.svg";
import AppointmentDetails from "components/common/AppointmentDetails/AppointmentDetailsBooking";
import ChooseServices from "components/common/BookingSteps/ChooseServices/ChooseServicesBooking";
import TimeOfArrival from "components/common/BookingSteps/TimeOfArrival/TimeOfArrivalBooking";
import ChooseAdvisor from "components/common/BookingSteps/ChooseAdvisor/ChooseAdvisorBooking";
import Transportation from "components/common/BookingSteps/Transportation/TransportationBooking";
import Button from "components/common/Button";
import { formatTimeInfo } from "./utils";
import CheckinModal from "./CheckinModal";
import ChooseRecalls from "./ChooseRecalls";
import "./styles.scss";

const PageTitle = ({ name }) => (
  <>
    <h2>Bookings / </h2>
    <span>{name}</span>
  </>
);

PageTitle.propTypes = {
  name: string,
};

PageTitle.defaultProps = {
  name: "",
};

class BookingDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteModalOpen: false,
      isCheckinModalOpen: false,
      isModifyBooking: false,
    };

    this.isMobileAndTablet = isMobileAndTablet();
  }

  componentDidMount() {
    const {
      onInitializeCheckin,
      fetchBookingDetails,
      match: {
        params: {
          guid,
          kind,
        },
      },
      dealershipId,
      booking,
      isLoading,
    } = this.props;

    if (
      (or(isEmpty(booking), isNil(booking)) && dealershipId && !isLoading)
      || (!isEmpty(booking) && !isNil(booking) && !booking.guid && dealershipId)
      || (!isEmpty(booking) && !isNil(booking) && booking.guid && booking.guid !== guid)
      || (!isEmpty(booking) && !isNil(booking) && booking.status !== "checked_in")
    ) {
      fetchBookingDetails(guid, dealershipId, kind);
      onInitializeCheckin({ dealershipId });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      fetchBookingDetails,
      match,
      dealershipId,
      booking,
      isLoading,
      saveAppointmentLoading,
      saveAppointmentError,
      isCheckedIn,
      isRoGenerated,
      updatedWithoutDmsNotification,
    } = this.props;

    if (
      (or(isEmpty(booking), isNil(booking)) && dealershipId && !isLoading)
      || (dealershipId && dealershipId !== prevProps.dealershipId && !isLoading)
    ) {
      fetchBookingDetails(match.params.guid, dealershipId, match.params.kind);
    }

    if (isCheckedIn || (prevProps.saveAppointmentLoading && !saveAppointmentLoading && !saveAppointmentError)) {
      window.location.reload();
    }

    if (isRoGenerated) {
      NotificationManager.success("Repair Order Generated.", "Success");
      setTimeout(() => window.location.reload(), 1000);
    }

    if (updatedWithoutDmsNotification && updatedWithoutDmsNotification !== prevProps.updatedWithoutDmsNotification) {
      NotificationManager.warning(updatedWithoutDmsNotification, "Warning");
      setTimeout(() => window.location.reload(), 3000);
    }
  }

  componentWillUnmount() {
    this.props.resetBookingDetailsState();
  }

  prepareHeaderText = () => {
    const { external_number, customer } = this.props.booking;
    const customerName = customer
      ? ` ${customer.first_name || ""} ${customer.last_name || ""}`
      : "";
    return `${external_number || ""} ${customerName}`;
  };

  handleCheckinOpen = () => {
    if (!this.props.isChatInitialized) this.props.onInitializeChat();
    this.setState({ isCheckinModalOpen: true });
  };

  renderContent = (isModifyBooking) => {
    const {
      isLoading,
      saveAppointmentLoading,
      error,
      saveAppointmentError,
      chosenTimeSlot,
      selectedAdvisor,
      selectedServices,
      isRemote,
      booking,
      booking: {
        vehicle,
        customer,
      },
    } = this.props;

    const isBookable = customer && customer.id && vehicle && vehicle.id;

    if (isLoading || saveAppointmentLoading) {
      return (
        <Panel className="conciergeBookingDetailsLoadingPanel">
          Loading...
        </Panel>
      );
    }
    if (error || saveAppointmentError) {
      return (
        <Panel className="conciergeBookingDetailsLoadingPanel">
          {error || error?.data || error?.message}
          {!!Array.isArray(saveAppointmentError) && (
            saveAppointmentError.map((error) => error.message)
          )}
          {saveAppointmentError.message}
        </Panel>
      );
    }

    if (isModifyBooking) {
      return (
        <section className="conciergeBookingDetailsModifyContainer">
          <section className="conciergeBookingDetailsModifyChoicePanel">
            <Accordion
              title="Choose services"
              customClass="schedulingProcessAccordion"
              concernCount={countSelectedServicesByType(
                "concern",
                selectedServices,
              )}
              maintenanceCount={countSelectedServicesByType(
                "maintenance",
                selectedServices,
              )}
              step={BOOKING_STEP_SERVICES}
            >
              <ChooseServices nextStep={BOOKING_STEP_RECALLS} />
            </Accordion>
            <Accordion
              title="Recalls"
              customClass="schedulingProcessAccordion"
              step={BOOKING_STEP_RECALLS}
            >
              <ChooseRecalls />
            </Accordion>
            <Accordion
              title="Service Advisor"
              step={BOOKING_STEP_ADVISOR}
              selectedValue={selectedAdvisor?.name}
              customClass="schedulingProcessAccordion"
            >
              <ChooseAdvisor preselectedAdvisor={selectedAdvisor} />
            </Accordion>
            <Accordion
              title={`Time of ${isRemote ? "Pickup" : "Arrival"}`}
              customClass="schedulingProcessAccordion"
              selectedValue={
                !isEmpty(chosenTimeSlot) && formatTimeInfo(chosenTimeSlot)
              }
              step={BOOKING_STEP_TIMESLOT}
            >
              <TimeOfArrival
                selectedAdvisor={selectedAdvisor}
                nextStep={BOOKING_STEP_TRANSPORT}
              />
            </Accordion>
            {!isRemote && (
              <Accordion title="Transportation" step={BOOKING_STEP_TRANSPORT}>
                <Transportation />
              </Accordion>
            )}
          </section>
          <Accordion
            expandable={false}
            title={isRemote ? "Pickup details" : "Appointment details"}
            customClass="conciergeBookingDetailsModifySummary"
          >
            <AppointmentDetails
              saveButtonLabel="Save changes"
              onSave={() => {
                this.props.saveAppointment();
                this.setState({ isModifyBooking: false });
              }}
            />
          </Accordion>
        </section>
      );
    }

    return (
      <section className="conciergeBookingDetailsContainer">
        <section className="conciergeBookingDetailsChoicePanel">
          <BookingDetailsPanel booking={booking} />
          <AlternativeTransportationPanel
            booking={booking}
          />
          <RemotePanel booking={booking} />
          <VideosPanel booking={booking} />
        </section>
        <div className="conciergeBookingDetailsSidebar">
          <BookingDetailsSummary booking={booking} />
          {!booking.repair_order_number && (
            <div className="conciergeBookingDetailsSidebarButtons">
              <Button
                variant="dark"
                fullWidth
                disabled={!isBookable}
                onClick={() => this.setState({ isModifyBooking: true })}
              >
                Modify / Reschedule
              </Button>
              <Button
                variant="dark"
                fullWidth
                disabled={!isBookable}
                onClick={() => {
                  this.props.onScheduleNewBooking();
                  this.props.history.push("/scheduling/process");
                }}
              >
                New appointment
              </Button>
              <Button
                variant="destructive-outline"
                icon="bin"
                fullWidth
                onClick={() => this.setState({ isDeleteModalOpen: true })}
              >
                <p>Cancel appointment</p>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  };

  render() {
    const {
      dealershipId,
      booking,
      isCheckedIn,
      isCheckinLoading,
      checkinError,
      isTriggerSmsLoading,
      isSmsSent,
      sendSms,
      setSendTextMessage,
      isAutoGenerateROenabled,
      isRoGenerated,
    } = this.props;
    const { isModifyBooking, isCheckinModalOpen } = this.state;

    const isCheckedInStatus = isCheckedIn || booking.status === "checked_in";
    const isOnSite = booking.status === "arrived";
    const isCancelled = booking.aasm_state === "canceled";
    if (isCancelled) return <Redirect to="/bookings" />;

    const isIOS = (/iPad|iPhone|iPod/.test(navigator.platform)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
      && !window.MSStream;

    const isRoCreated = !!booking.repair_order_number || isRoGenerated;

    const isGenerateROAvailable = !isAutoGenerateROenabled
      && !isRoCreated
      && booking?.vehicle?.vin
      && booking?.vehicle?.mileage;

    return (
      <section className="conciergeBookingDetailsPage">
        <NotificationContainer />
        {isModifyBooking ? (
          <PageHeader title={(
            <>
              <a
                type="button"
                onClick={() => this.setState({ isModifyBooking: false })}
                className="conciergeBookingDetailsGoBackButton"
              >
                <img src={ArrowLeft} alt="" />
              </a>
              <h2>Modify or Reschedule the Appointment</h2>
            </>
          )}
          />
        ) : (
          <PageHeader
            title={(
              <>
                <Link
                  to={{ pathname: "/bookings" }}
                  className="conciergeBookingDetailsGoBackButton"
                >
                  <img src={ArrowLeft} alt="" />
                  <PageTitle name={this.prepareHeaderText()} />
                </Link>
                <div className="conciergeBookingDetailsButtonsWrap">
                  {isCheckinLoading ? (
                    <img className="conciergeBookingDetailsButtonsLoading" src={loadingGif} alt="Loading ..." />
                  ) : (
                    <>
                      <Button
                        variant="success"
                        onClick={this.handleCheckinOpen}
                        disabled={checkinError || isCheckedInStatus || isOnSite}
                      >
                        {isOnSite ? "Arrived"
                          : isCheckedInStatus
                            ? "Checked in"
                            : "Check-in"}
                      </Button>
                      {!isCheckedInStatus && !isRoCreated && !isOnSite && (
                        <Button
                          variant="dark-outline"
                          onClick={() => this.props.inviteToCheckin()}
                          disabled={isTriggerSmsLoading || isSmsSent}
                        >
                          {isSmsSent && "Invite sent"}
                          {isTriggerSmsLoading && "Sending sms..."}
                          {!isSmsSent && !isTriggerSmsLoading && "Invite to check-in"}
                        </Button>
                      )}
                      {(isIOS || this.isMobileAndTablet) && !isRoCreated && (
                        <Button
                          variant="dark"
                          onClick={() => window.open("carmenarrive://")}

                        >
                          Video inspection
                        </Button>
                      )}
                      {isGenerateROAvailable && (
                        <Button
                          variant="brand"
                          onClick={() => this.props.createRo(booking.id)}
                        >
                          Create RO
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          />
        )}
        <section className="conciergeBookingDetailsMain">
          {this.renderContent(isModifyBooking)}
        </section>
        {this.state.isDeleteModalOpen && (
        <Modal
          title="Wait. Are you sure?"
          text="Booking data will be lost. Customer will be notified about cancelation."
          cancelButtonText="No"
          submitButtonText="Yes"
          submitButtonVariant="destructive"
          cancelButtonVariant="dark"
          size="small"
          onSubmit={() => {
            this.props.onDeleteBooking(booking.id, dealershipId);
            this.setState({ isDeleteModalOpen: false });
          }}
          onCancel={() => this.setState({ isDeleteModalOpen: false })}
        >
          <div
            className="sendSmsToggle"
            onClick={() => setSendTextMessage(!sendSms)}
          >
            <img
              src={!sendSms ? CheckedIcon : UncheckedIcon}
              alt="checkbox"
            />
            <span>
              Do not notify customer
            </span>
          </div>
        </Modal>
        )}
        {isCheckinModalOpen && (
          <CheckinModal
            onClose={() => {
              this.setState({ isCheckinModalOpen: false });
              this.props.onReset();
            }}
          />
        )}
      </section>
    );
  }
}

BookingDetailsPage.propTypes = {
  fetchBookingDetails: func,
  saveAppointment: func.isRequired,
  createRo: func.isRequired,
  onDeleteBooking: func.isRequired,
  inviteToCheckin: func.isRequired,
  fetchBookingDetailsCheckin: func.isRequired,
  onInitializeCheckin: func.isRequired,
  onInitializeChat: func.isRequired,
  isLoading: bool,
  isTriggerSmsLoading: bool,
  saveAppointmentLoading: bool,
  dealershipId: oneOfType([string, number]),
  /* eslint-disable react/forbid-prop-types */
  booking: object,
  error: object,
  saveAppointmentError: object,
  /* eslint-enable */
  match: matchType,
  chosenTimeSlot: chosenTimeSlotPropType,
  selectedAdvisor: serviceAdvisorPropType,
  selectedServices: arrayOf(servicePropType),
  isRemote: bool.isRequired,
  isCheckinLoading: bool.isRequired,
};

BookingDetailsPage.defaultProps = {
  fetchBookingDetails: null,
  isLoading: false,
  saveAppointmentLoading: false,
  dealershipId: null,
  booking: null,
  error: null,
  saveAppointmentError: null,
  match: null,
  chosenTimeSlot: {},
  selectedAdvisor: {},
  selectedServices: [],
};

const mapStateToProps = (state) => ({
  selectedRecalls: bookingSelectedRecallsSelector(state),
  isLoading: bookingDetailsLoadingStateSelector(state),
  isTriggerSmsLoading: bookingDetailsIsTriggerSmsLoadingSelector(state),
  isSmsSent: bookingDetailsIsSmsSentSelector(state),
  booking: bookingDetailsDataSelector(state),
  error: bookingDetailsErrorSelector(state),
  chosenTimeSlot: bookingDetailsChosenTimeSlotSelector(state),
  selectedAdvisor: bookingDetailsSelectedAdvisorSelector(state),
  selectedServices: bookingDetailsSelectedServicesSelector(state),
  dealershipId: dealershipIdSelector(state),
  saveAppointmentLoading: bookingDetailsSaveAppointmentLoadingSelector(state),
  saveAppointmentError: bookingDetailsSaveAppointmentErrorSelector(state),
  updatedWithoutDmsNotification: bookingDetailsUpdatedWithoutDmsNotificationSelector(state),
  isRemote: bookingDetailsIsRemoteSelector(state),
  isCheckinLoading: checkinAppointmentLoadingSelector(state),
  checkinError: checkinAppointmentErrorSelector(state),
  isCheckedIn: bookingDetailsIsCheckedInSelector(state),
  isChatInitialized: chatIsInitializedSelector(state),
  isRoGenerated: bookingDetailsIsROGeneratedSelector(state),
  checkinId: appCheckinIdSelector(state),
  sendSms: bookingDetailsSendSmsSelector(state),
  isAutoGenerateROenabled: settingsIsAutoGenerateROSelector(state),
});

const actions = {
  fetchBookingDetails: retrieveBookingDetails,
  onDeleteBooking: deleteBooking,
  saveAppointment: updateAppointment,
  onInitializeCheckin: initializeCheckIn,
  fetchBookingDetailsCheckin: importAppointmentByGuid,
  onReset: exit,
  onInitializeChat: initializeChat,
  inviteToCheckin: triggerCheckinSms,
  resetBookingDetailsState: resetBookingDetails,
  onScheduleNewBooking: scheduleNewBooking,
  setSendTextMessage: setSendSms,
  createRo: generateRO,
};

export default connect(mapStateToProps, actions)(BookingDetailsPage);
