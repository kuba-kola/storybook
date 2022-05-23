import React from "react";
import {
  arrayOf, bool, number, string, func,
} from "prop-types";
import { isEmpty } from "ramda";

import {
  vehiclePropType,
  customerPropType,
  servicePropType,
  chosenTimeSlotPropType,
  serviceAdvisorPropType,
} from "shared/prop-types";

import CheckedIcon from "assets/images/bookings/checked.svg";
import UncheckedIcon from "assets/images/bookings/unchecked.svg";
import SelectedServicesAndTotalCost from "./SelectedServicesAndTotalCost";
import BookAppointmentButton from "./BookAppointmentButton";
import OwnerInformation from "./OwnerInformation";
import AdvisorInformation from "./AdvisorInformation";
import PickupInformation from "./PickupInformation";

import "./styles.scss";

const AppointmentDetails = ({
  vehicle,
  customer,
  selectedServices,
  selectedRecalls,
  selectedAdvisor,
  chosenTimeSlot,
  sendSms,
  contactNumber,
  isRemote,
  remoteJobData,
  onSave,
  saveButtonLabel,
  setSendTextMessage,
}) => {
  const isCommunicationComplete = () => ((sendSms && contactNumber) || !sendSms);
  const isRemoteComplete = () => {
    if (isRemote) {
      return remoteJobData && !isEmpty(remoteJobData.addressData);
    }
    return true;
  };
  const allServices = () => selectedServices.concat(selectedRecalls);

  const isAppointmentComplete = () => (
    allServices().length
    && chosenTimeSlot.quarterSlot
    && isCommunicationComplete()
    && isRemoteComplete()
  );

  return (
    <div className="appointmentDetailsContainer">
      <OwnerInformation
        customer={customer}
        vehicle={vehicle}
        sendSms={sendSms}
        contactNumber={contactNumber}
      />
      {isRemote && remoteJobData && remoteJobData.address && remoteJobData.collectionTime && (
        <PickupInformation
          address={remoteJobData.address}
          collectionTime={remoteJobData.collectionTime}
        />
      )}
      {selectedAdvisor && (<AdvisorInformation advisor={selectedAdvisor} />)}
      {!!(isEmpty(selectedAdvisor) && selectedServices.length) && (
        <div className="appointmentDetailsSection">Please select the advisor</div>
      )}
      {allServices().length ? (
        <>
          <SelectedServicesAndTotalCost
            selectedServices={allServices()}
          />
        </>
      ) : (
        <div className="appointmentDetailsSection">
          Please add services to book an appointment
        </div>
      )}
      {!!(allServices().length && selectedAdvisor && isEmpty(chosenTimeSlot)) && (
        <div className="appointmentDetailsSection">
          {isRemote
            ? "Please select collection time to book pickup"
            : "Please select time of arrival to book an appointment"}
        </div>
      )}
      {setSendTextMessage && (
        <div className="appointmentDetailsSection">
          <div
            className="appointmentDetailsSendSmsToggle"
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
        </div>
      )}
      <div className="appointmentDetailsDivider" />
      <BookAppointmentButton
        isAppointmentComplete={!!isAppointmentComplete()}
        onClick={onSave}
        label={saveButtonLabel}
      />
    </div>
  );
};

AppointmentDetails.propTypes = {
  vehicle: vehiclePropType,
  customer: customerPropType,
  selectedServices: arrayOf(servicePropType),
  selectedRecalls: arrayOf(servicePropType),
  selectedAdvisor: arrayOf(serviceAdvisorPropType),
  chosenTimeSlot: chosenTimeSlotPropType,
  sendSms: bool.isRequired,
  isRemote: bool.isRequired,
  contactNumber: number.isRequired,
  remoteJobData: {
    location: string,
    collectionTime: string,
  },
  onSave: func,
  saveButtonLabel: string,
};

AppointmentDetails.defaultProps = {
  vehicle: {},
  customer: {},
  selectedServices: [],
  selectedRecalls: [],
  selectedAdvisor: null,
  chosenTimeSlot: {},
  remoteJobData: {},
  onSave: () => { },
  saveButtonLabel: "",
};

export default AppointmentDetails;
