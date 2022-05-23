import React, { useCallback, useEffect, useRef } from "react";
import {
  object, shape, bool, func, array,
} from "prop-types";

import { isAllowedToUpdate } from "components/pages/BookingDetailsPage/RemotePanel/utils";
import { usePrevious } from "shared/hooks";
import DriversPicker from "components/common/Remote/DriversPicker";
import DriversNotes from "components/common/Remote/DriversNotes";

const DriversItem = ({
  additionalInfo,
  additionalInfo: { pickUp, dropOff },
  onChange,
  isPickUp,
  isDropOff,
  isLoadingPickUpDrivers,
  availablePickUpDrivers,
  isLoadingDropOffDrivers,
  availableDropOffDrivers,
  fetchAvailableDriversHandle,
  pickUpJobFind,
  dropOffJobFind,
}) => {
  const prevPickUpValues = usePrevious(pickUp);
  const prevDropOffValues = usePrevious(dropOff);

  const handlePickUpDrivers = useCallback(() => {
    if (
      !availablePickUpDrivers.length || (prevPickUpValues
        && (pickUp.date !== prevPickUpValues.date
          || pickUp.time !== prevPickUpValues.time
          || pickUp.address !== prevPickUpValues.address
        ))
    ) {
      fetchAvailableDriversHandle(pickUp.address, { date: pickUp.date, time: pickUp.time }, "pickUp");
    }
  }, [pickUp.date, pickUp.time, pickUp.address, isLoadingPickUpDrivers]);

  const handleDropOffDrivers = useCallback(() => {
    if (
      !availableDropOffDrivers.length || (prevDropOffValues
        && (dropOff.date !== prevDropOffValues.date
          || dropOff.time !== prevDropOffValues.time
          || dropOff.address !== prevDropOffValues.address))
    ) {
      fetchAvailableDriversHandle(dropOff.address, { date: dropOff.date, time: dropOff.time }, "dropOff");
    }
  }, [dropOff.date, dropOff.time, dropOff.address, isLoadingDropOffDrivers]);

  useEffect(() => {
    if (
      prevPickUpValues
      && (pickUp.date !== prevPickUpValues.date
        || pickUp.time !== prevPickUpValues.time
        || pickUp.address !== prevPickUpValues.address)
      && (pickUp.driver !== "" || pickUp.coDriver !== "")
    ) {
      onChange({
        pickUp: {
          ...pickUp,
          driver: "",
          coDriver: "",
        },
      });
    }
  }, [pickUp.date, pickUp.time, pickUp.address]);

  useEffect(() => {
    if (
      prevDropOffValues
      && (dropOff.date !== prevDropOffValues.date
        || dropOff.time !== prevDropOffValues.time
        || dropOff.address !== prevDropOffValues.address)
      && (dropOff.driver !== "" || dropOff.coDriver !== "")
    ) {
      onChange({
        dropOff: {
          ...dropOff,
          driver: "",
          coDriver: "",
        },
      });
    }
  }, [dropOff.date, dropOff.time, dropOff.address]);

  const isDisabled = () => {
    if (isPickUp) return pickUpJobFind && !isAllowedToUpdate(pickUpJobFind.aasm_state);
    if (isDropOff) return dropOffJobFind && !isAllowedToUpdate(dropOffJobFind.aasm_state);
    return false;
  };

  return (
    <div className="row conciergeBookingDetailsPanelDriversItem">
      <DriversPicker
        isDriver
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
        isDropOff={isDropOff}
        isLoadingPickUpDrivers={isLoadingPickUpDrivers}
        availablePickUpDrivers={availablePickUpDrivers}
        isLoadingDropOffDrivers={isLoadingDropOffDrivers}
        availableDropOffDrivers={availableDropOffDrivers}
        handlePickUpDrivers={handlePickUpDrivers}
        handleDropOffDrivers={handleDropOffDrivers}
        disabled={isDisabled()}
      />
      <DriversPicker
        isCoDriver
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
        isDropOff={isDropOff}
        isLoadingPickUpDrivers={isLoadingPickUpDrivers}
        availablePickUpDrivers={availablePickUpDrivers}
        isLoadingDropOffDrivers={isLoadingDropOffDrivers}
        availableDropOffDrivers={availableDropOffDrivers}
        handlePickUpDrivers={handlePickUpDrivers}
        handleDropOffDrivers={handleDropOffDrivers}
        disabled={isDisabled()}
      />
      <DriversNotes
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
        isDropOff={isDropOff}
        disabled={isDisabled()}
      />
    </div>
  );
};

DriversItem.propTypes = {
  onChange: func.isRequired,
  isPickUp: bool,
  isDropOff: bool,
  /* eslint-disable react/forbid-prop-types */
  additionalInfo: shape({
    pickUp: object,
    dropOff: object,
  }),
  availablePickUpDrivers: array,
  availableDropOffDrivers: array,
  pickUpJobFind: object,
  dropOffJobFind: object,
  /* eslint-enable react/forbid-prop-types */
  fetchAvailableDriversHandle: func.isRequired,
  isLoadingPickUpDrivers: bool,
  isLoadingDropOffDrivers: bool,
};

DriversItem.defaultProps = {
  additionalInfo: {},
  isPickUp: false,
  isDropOff: false,
  isLoadingPickUpDrivers: false,
  availablePickUpDrivers: [],
  isLoadingDropOffDrivers: false,
  availableDropOffDrivers: [],
  pickUpJobFind: {},
  dropOffJobFind: {},
};

export default DriversItem;
