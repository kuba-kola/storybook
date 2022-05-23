import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  func,
  bool,
  number,
  string,
} from "prop-types";
import { isEmpty, isNil } from "ramda";
import cx from "classnames";

import Input from "components/common/Input";
import RadioButton from "components/common/RadioButton";

import {
  setSendSms,
  setCommunication,
  setCurrentStep,
} from "store/actions/scheduling-process-actions";
import {
  schedulingProcessSendSmsSelector,
  schedulingProcessContactNumberSelector,
} from "store/selectors/scheduling-process-selectors";
import { dmsTypeSelector } from "store/selectors/settings-selectors";
import { isPhoneNumberType, extractPhoneNumberFromString } from "shared/utils/common";
import { phoneNumberLengthValidator } from "shared/validators";
import { BOOKING_STEP_REMOTE, BOOKING_STEP_TRANSPORT } from "shared/constants";

import "./styles.scss";

const Communication = ({
  sendSms,
  contactNumber,
  dmsType,
  setSmsConsent,
  setCommunicationNumber,
  setSchedulingStep,
  isRemote,
}) => {
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(contactNumber);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    if (sendSms === false) {
      setSubmitDisabled(false);
    } else if (sendSms === true && phoneNumber && isNil(phoneNumberError)) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [sendSms, phoneNumber, phoneNumberError]);

  const updateContactNumber = (newContactNumber) => {
    setPhoneNumber(newContactNumber);
    setPhoneNumberError(null);
    if (isEmpty(newContactNumber)) {
      setCommunicationNumber(null);
      setPhoneNumberError("Contact number can't be blank");
      return;
    }

    const isPhoneNumber = isPhoneNumberType(newContactNumber);
    if (!isPhoneNumber) {
      setCommunicationNumber(null);
      setPhoneNumberError("Please provide correct phone number");
      return;
    }

    const extractedPhoneNumber = extractPhoneNumberFromString(newContactNumber);
    const isValid = phoneNumberLengthValidator(newContactNumber, dmsType);

    if (isValid) {
      setCommunicationNumber(extractedPhoneNumber);
    } else {
      setCommunicationNumber(null);
      setPhoneNumberError("Please provide correct phone number");
    }
  };

  const updateSmsConsent = (value) => {
    if (value === false) {
      setPhoneNumberError(null);
    }
    setSmsConsent(value);
  };

  return (
    <>
      <div className="communicationStepContainer">
        <div className="communicationStepSection">
          <header className="communicationStepSectionHeader">
            Send SMS with confirmation?
          </header>
          <div className="communicationStepOptionsContainer">
            <RadioButton
              id="communicationStepRadioTrue"
              isChecked={sendSms}
              labelText="Yes"
              onClick={() => updateSmsConsent(true)}
            />
            <RadioButton
              id="communicationStepRadioFalse"
              isChecked={!sendSms}
              labelText="No"
              onClick={() => updateSmsConsent(false)}
            />
          </div>
        </div>
        <div className="communicationStepSection">
          <header className="communicationStepSectionHeader">
            Phone number:
          </header>
          <Input
            placeholder="Contact number"
            value={phoneNumber}
            disabled={!sendSms}
            onChange={updateContactNumber}
            error={phoneNumberError}
          />
        </div>
      </div>
      <div className="conciergeSchedulingSubmitWrapper">
        <button
          type="button"
          className={cx(
            "conciergeSchedulingButton",
            "conciergeSchedulingSubmitButton",
            "conciergeSchedulingTimeSubmitButton",
            { conciergeSchedulingButtonDisabled: submitDisabled },
          )}
          onClick={submitDisabled
            ? null
            : () => setSchedulingStep(isRemote ? BOOKING_STEP_REMOTE : BOOKING_STEP_TRANSPORT)}
        >
          Done
        </button>
      </div>
    </>
  );
};

Communication.propTypes = {
  sendSms: bool.isRequired,
  contactNumber: number.isRequired,
  dmsType: string.isRequired,
  setSmsConsent: func.isRequired,
  setCommunicationNumber: func.isRequired,
  setSchedulingStep: func.isRequired,
};

const mapStateToProps = (state) => ({
  sendSms: schedulingProcessSendSmsSelector(state),
  contactNumber: schedulingProcessContactNumberSelector(state),
  dmsType: dmsTypeSelector(state),
});

const actions = {
  setSmsConsent: setSendSms,
  setCommunicationNumber: setCommunication,
  setSchedulingStep: setCurrentStep,
};

export default connect(mapStateToProps, actions)(Communication);
