import React, { useEffect, useState, useRef } from "react";
import {
  func, arrayOf, bool, string,
} from "prop-types";
import dateFns from "date-fns";
import { daySlotPropType, chosenTimeSlotPropType, serviceAdvisorPropType } from "shared/prop-types";
import { timeInUSFormat } from "shared/utils/datetime";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import Picker from "./Picker";
import "./styles.scss";

const TimeOfArrival = ({
  fetchDays,
  availableDays,
  setChosenQuarterSlot,
  chosenTimeSlot,
  chosenTimeSlot: { quarterSlot: chosenQuarterSlot },
  setSchedulingStep,
  schedulingTimeSlotsLoading,
  schedulingTimeSlotsLoadingError,
  selectedAdvisor,
  isRemote,
  nextStep,
}) => {
  const [bookableDays, setBookableDays] = useState([]);
  const [appointmentSlotsLoading, setAppointmentSlotsLoading] = useState(false);
  const [noAdvisor, setNoAdvisor] = useState(true);
  const [firstAdvisor] = useState(selectedAdvisor || null);
  const containerRef = useRef(null);

  const resetChosenSlot = () => {
    setChosenQuarterSlot({});
  };

  const handleUpdateBookableDays = () => {
    setBookableDays(availableDays);
    setAppointmentSlotsLoading(!appointmentSlotsLoading);
  };

  const handleAddCurrentSlotChoice = () => {
    if (!firstAdvisor || !selectedAdvisor) return;

    if (firstAdvisor.id === selectedAdvisor.id) {
      if (chosenTimeSlot.day) {
        const result = bookableDays.find((item) => item.full_date === chosenTimeSlot.day.full_date);

        if (result) {
          setBookableDays(
            bookableDays.map((item) => (
              item.full_date === chosenTimeSlot.day.full_date
                ? (
                  {
                    ...item,
                    slots: item.slots.indexOf(chosenTimeSlot.quarterSlot) < 0
                      ? [chosenTimeSlot.quarterSlot, ...item.slots]
                      : item.slots,
                  }
                ) : (
                  item
                )
            )),
          );
        }
      }
    } else {
      handleUpdateBookableDays();
    }
  };

  useEffect(() => {
    handleAddCurrentSlotChoice();
  }, [chosenTimeSlot]);

  useEffect(() => {
    if (selectedAdvisor) {
      setAppointmentSlotsLoading(true);
      setNoAdvisor(false);
      resetChosenSlot();
      fetchDays(selectedAdvisor.service_advisor_id || selectedAdvisor.id);
    }
  }, [selectedAdvisor]);

  useEffect(() => {
    handleUpdateBookableDays();
  }, [availableDays]);

  const handleQuarterSlotChoice = (quarterSlot, day, overcapacity, walkin) => {
    const payload = {
      quarterSlot,
      day,
      overcapacity,
      walkin,
    };

    setChosenQuarterSlot(payload);
  };

  const formatTimeInfo = () => {
    if (chosenTimeSlot && !chosenTimeSlot.day) return "";
    const { day: { full_date }, quarterSlot } = chosenTimeSlot;
    const time = timeInUSFormat(quarterSlot);
    return `${dateFns.format(full_date, "dddd, MMMM D, YYYY")}, ${time}`;
  };

  if (schedulingTimeSlotsLoading) {
    return <Panel className="conciergeSchedulingLoadingPanel">Loading...</Panel>;
  }

  if (noAdvisor) {
    return <Panel className="conciergeSchedulingLoadingPanel">Please select service advisor first</Panel>;
  }

  if (schedulingTimeSlotsLoadingError) {
    return <Panel className="conciergeSchedulingLoadingPanel">Please try again.</Panel>;
  }

  return (
    <div ref={containerRef} className="schedulingCalendarContainer">
      {!!bookableDays.length && chosenTimeSlot
        ? (
          <>
            <Picker
              days={bookableDays}
              chosenTimeSlot={chosenTimeSlot}
              onSetTimeSlot={handleQuarterSlotChoice}
              onReset={resetChosenSlot}
              isRemote={isRemote}
            />
            <div className="schedulingCalendarButtons">
              <div className="schedulingCalendarCurrent">
                {formatTimeInfo()}
              </div>
              <Button
                variant="brand"
                disabled={!chosenQuarterSlot}
                onClick={() => setSchedulingStep(nextStep)}
              >
                Done
              </Button>
            </div>
          </>
        )
        : (
          <Panel className="conciergeSchedulingLoadingPanel">
            This advisor doesn&apos;t have any slots left.
          </Panel>
        )}
    </div>
  );
};

TimeOfArrival.propTypes = {
  fetchDays: func.isRequired,
  availableDays: arrayOf(daySlotPropType),
  setChosenQuarterSlot: func.isRequired,
  chosenTimeSlot: chosenTimeSlotPropType.isRequired,
  setSchedulingStep: func.isRequired,
  schedulingTimeSlotsLoading: bool.isRequired,
  schedulingTimeSlotsLoadingError: bool.isRequired,
  selectedAdvisor: serviceAdvisorPropType,
  isRemote: bool.isRequired,
  nextStep: string,
};

TimeOfArrival.defaultProps = {
  availableDays: [],
  selectedAdvisor: null,
  nextStep: "",
};

export default TimeOfArrival;
