import React, { useCallback, useEffect } from "react";
import {
  shape, bool, func, array,
} from "prop-types";
import { remoteAdditionalInfoJobPropType } from "components/common/Remote/propTypes";

import { usePrevious } from "shared/hooks";
import DriversPicker from "./DriversPicker";
import DriversNotes from "./DriversNotes";

const DriversItem = ({
  additionalInfo,
  additionalInfo: { pickUp },
  onChange,
  isPickUp,
  isLoadingPickUpDrivers,
  availablePickUpDrivers,
  fetchAvailableDriversHandle,
}) => {
  const prevPickUpValues = usePrevious(pickUp);

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

  return (
    <div className="row">
      <DriversPicker
        isDriver
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
        isLoadingPickUpDrivers={isLoadingPickUpDrivers}
        availablePickUpDrivers={availablePickUpDrivers}
        handlePickUpDrivers={handlePickUpDrivers}

      />
      <DriversPicker
        isCoDriver
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
        isLoadingPickUpDrivers={isLoadingPickUpDrivers}
        availablePickUpDrivers={availablePickUpDrivers}
        handlePickUpDrivers={handlePickUpDrivers}
      />
      <DriversNotes
        additionalInfo={additionalInfo}
        onChange={onChange}
        isPickUp={isPickUp}
      />
    </div>
  );
};

DriversItem.propTypes = {
  onChange: func.isRequired,
  isPickUp: bool,
  additionalInfo: shape({
    pickUp: remoteAdditionalInfoJobPropType,
  }),
  isLoadingPickUpDrivers: bool,
  // eslint-disable-next-line react/forbid-prop-types
  availablePickUpDrivers: array,
  fetchAvailableDriversHandle: func.isRequired,
};

DriversItem.defaultProps = {
  additionalInfo: {},
  isPickUp: false,
  isLoadingPickUpDrivers: false,
  availablePickUpDrivers: [],
};

export default DriversItem;
