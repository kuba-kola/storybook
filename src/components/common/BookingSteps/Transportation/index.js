import React, { useEffect, useState } from "react";
import {
  func,
  bool,
  arrayOf,
  string,
} from "prop-types";
import cx from "classnames";
import { chosenTimeSlotPropType, servicePropType } from "shared/prop-types";

import RadioButton from "components/common/RadioButton";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import { BOOKING_STEP_TRANSPORT } from "shared/constants";

import "./styles.scss";
import { isEmpty } from "ramda";

const Transportation = ({
  setIsWaiting,
  setTransport,
  currentStep,
  fetchAvailableTransport,
  chosenTimeSlot: { quarterSlot: chosenQuarterSlot },
  clientWaiting,
  selectedTransport,
  selectedServices,
  setSchedulingStep,
  availableTransports,
  availableTransportsLoading,
  availableTransportsError,
}) => {
  const [noAppointmentDatetime, setNoAppointmentDatetime] = useState(true);

  useEffect(() => {
    if (chosenQuarterSlot && !isEmpty(chosenQuarterSlot) && currentStep === BOOKING_STEP_TRANSPORT) {
      fetchAvailableTransport();
      setNoAppointmentDatetime(false);
    }
  }, [chosenQuarterSlot, currentStep]);

  useEffect(() => {
    setTransport(null);
  }, [chosenQuarterSlot, selectedServices]);

  if (noAppointmentDatetime) {
    return <Panel className="conciergeSchedulingLoadingPanel">Please select appointment datetime first</Panel>;
  }

  return (
    <div>
      <header className="transportationQuestion">
        Will customer be waiting for your car at the dealership?
      </header>
      <div className="transportationRadioContainer">
        <RadioButton
          id="transportationRadioTrue"
          isChecked={clientWaiting}
          labelText="Yes"
          onClick={() => setIsWaiting(true)}
        />
        <RadioButton
          id="transportationRadioFalse"
          isChecked={!clientWaiting}
          labelText="No"
          onClick={() => setIsWaiting(false)}
        />
      </div>
      {clientWaiting === false && (
        <>
          <header className="transportationSelect">
            Does the customer need alternative transportation? The following options are available:
          </header>
          <div className="transportationContainer">
            {availableTransportsLoading && (<Panel className="conciergeSchedulingLoadingPanel">Loading...</Panel>)}
            {availableTransportsError && (
              <Panel className="conciergeSchedulingLoadingPanel">Please try again.</Panel>
            )}
            {availableTransports.map((t) => (
              <button
                type="button"
                className={cx("conciergeSchedulingButton transportButton", {
                  transportSelected: selectedTransport === t,
                })}
                onClick={() => setTransport(selectedTransport === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="conciergeSchedulingSubmitWrapper">
        <Button
          variant="brand"
          onClick={() => setSchedulingStep("")}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

Transportation.propTypes = {
  setIsWaiting: func.isRequired,
  setTransport: func.isRequired,
  clientWaiting: bool.isRequired,
  chosenTimeSlot: chosenTimeSlotPropType,
  currentStep: string.isRequired,
  setSchedulingStep: func.isRequired,
  fetchAvailableTransport: func.isRequired,
  selectedTransport: string,
  selectedServices: arrayOf(servicePropType),
  availableTransports: arrayOf(string),
  availableTransportsLoading: bool.isRequired,
  availableTransportsError: bool.isRequired,
};

Transportation.defaultProps = {
  availableTransports: [],
  selectedTransport: null,
  selectedServices: [],
  chosenTimeSlot: null,
};

export default Transportation;
