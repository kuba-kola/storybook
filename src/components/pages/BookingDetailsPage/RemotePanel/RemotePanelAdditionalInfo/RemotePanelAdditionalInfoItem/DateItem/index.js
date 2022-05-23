import React, { useCallback, useState } from "react";
import dateFns from "date-fns";
import {
  object, bool, func, shape, arrayOf,
} from "prop-types";
import { daySlotPropType } from "shared/prop-types";

import { isAllowedToUpdate } from "components/pages/BookingDetailsPage/RemotePanel/utils";
import Picker from "components/common/BookingSteps/TimeOfArrival/Picker";

const DateItem = ({
  isPickUp,
  isDropOff,
  bookableDays,
  additionalInfo,
  additionalInfo: { pickUp, dropOff },
  onChange,
  pickUpJobFind,
  dropOffJobFind,
}) => {
  const getCollectionTime = () => {
    if (isPickUp) return pickUp.collectionTime;
    if (isDropOff) return dropOff.collectionTime;
    return "";
  };

  const [chosenTimeSlot, setChosenQuarterSlot] = useState({
    quarterSlot: dateFns.format(getCollectionTime(), "HH:mm"),
    day: bookableDays.find((day) => day.full_date === dateFns.format(getCollectionTime(), "YYYY-MM-DD")),
  });

  const resetChosenSlot = () => {
    setChosenQuarterSlot({});
  };

  const handleQuarterSlotChoice = useCallback((quarterSlot, day) => {
    const payload = {
      quarterSlot,
      day,
    };
    if (isPickUp) {
      onChange({
        pickUp: {
          ...pickUp,
          date: day.full_date,
          time: quarterSlot,
        },
      });
    } else if (isDropOff) {
      onChange({
        dropOff: {
          ...dropOff,
          date: day.full_date,
          time: quarterSlot,
        },
      });
    }

    setChosenQuarterSlot(payload);
  }, [onChange]);

  if (isPickUp && pickUpJobFind && !isAllowedToUpdate(pickUpJobFind.aasm_state)) return null;
  if (isDropOff && dropOffJobFind && !isAllowedToUpdate(dropOffJobFind.aasm_state)) return null;
  return (
    <div className="row conciergeBookingDetailsPanelDateLocationItem">
      <Picker
        days={bookableDays}
        chosenTimeSlot={chosenTimeSlot}
        onSetTimeSlot={(quarterSlot, day) => handleQuarterSlotChoice(quarterSlot, day)}
        onReset={resetChosenSlot}
        isRemote
      />

    </div>
  );
};

DateItem.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  pickUpJobFind: object,
  dropOffJobFind: object,
  additionalInfo: shape({
    pickUp: object,
    dropOff: object,
  }),
  /* eslint-enable react/forbid-prop-types */
  isPickUp: bool,
  isDropOff: bool,
  onChange: func.isRequired,
  bookableDays: arrayOf(daySlotPropType).isRequired,
};

DateItem.defaultProps = {
  pickUpJobFind: {},
  dropOffJobFind: {},
  additionalInfo: {},
  isPickUp: false,
  isDropOff: false,
};

export default DateItem;
