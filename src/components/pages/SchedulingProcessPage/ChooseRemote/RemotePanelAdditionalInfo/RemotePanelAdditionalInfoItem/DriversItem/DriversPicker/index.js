import React, { useCallback } from "react";
import {
  object, array, shape, bool, func,
} from "prop-types";

import DriversDropdown from "./DriversDropdown";

const DriversPicker = ({
  isDriver,
  isCoDriver,
  additionalInfo,
  additionalInfo: {
    pickUp, dropOff,
  },
  onChange,
  isPickUp,
  isDropOff,
  isLoadingPickUpDrivers,
  availablePickUpDrivers,
  isLoadingDropOffDrivers,
  availableDropOffDrivers,
  handlePickUpDrivers,
  handleDropOffDrivers,
  disabled,
}) => {
  const labelDriver = () => {
    if (isDriver) return "Driver";
    if (isCoDriver) return "Co-Driver";
    return "";
  };

  const handleOpen = useCallback(() => {
    if (isPickUp) {
      handlePickUpDrivers();
    } else if (isDropOff) {
      handleDropOffDrivers();
    }
  }, [handlePickUpDrivers, handleDropOffDrivers]);

  const isDisabled = useCallback(() => {
    if (isPickUp) {
      return isLoadingPickUpDrivers || !(pickUp.address && pickUp.time && pickUp.date);
    } if (isDropOff) {
      return isLoadingDropOffDrivers || !(dropOff.address && dropOff.time && dropOff.date);
    }
    return false;
  }, [additionalInfo, isLoadingPickUpDrivers, isLoadingDropOffDrivers]);

  const onChangeDriver = useCallback((value) => {
    if (isDriver) {
      if (isPickUp) {
        onChange({
          pickUp: {
            ...pickUp,
            driver: value,
          },
        });
      } else if (isDropOff) {
        onChange({
          dropOff: {
            ...dropOff,
            driver: value,
          },
        });
      }
    } else if (isCoDriver) {
      if (isPickUp) {
        onChange({
          pickUp: {
            ...pickUp,
            coDriver: value,
          },
        });
      } else if (isDropOff) {
        onChange({
          dropOff: {
            ...dropOff,
            coDriver: value,
          },
        });
      }
    }
  }, [onChange, additionalInfo]);

  const valueDriver = () => {
    if (isDriver) {
      if (isPickUp) return pickUp.driver;
      if (isDropOff) return dropOff.driver;
    }
    if (isCoDriver) {
      if (isPickUp) return pickUp.coDriver;
      if (isDropOff) return dropOff.coDriver;
    }
    return "";
  };

  return (
    <div className="additionalInfoItemColumn">
      <div className="conciergeInputLabel">
        {labelDriver()}
      </div>
      <DriversDropdown
        options={isPickUp ? availablePickUpDrivers : availableDropOffDrivers}
        placeholder={`Select ${labelDriver()}`}
        onSelect={(item) => onChangeDriver(item)}
        defaultSelected={valueDriver()}
        readOnly={disabled || isDisabled()}
        handleOpen={handleOpen}
        isLoading={isPickUp ? isLoadingPickUpDrivers : isLoadingDropOffDrivers}
      />
    </div>
  );
};

DriversPicker.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  isDriver: bool,
  isCoDriver: bool,
  onChange: func.isRequired,
  isPickUp: bool,
  isDropOff: bool,
  additionalInfo: shape({
    pickUp: object,
    dropOff: object,
  }),
  isLoadingPickUpDrivers: bool,
  availablePickUpDrivers: array,
  isLoadingDropOffDrivers: bool,
  availableDropOffDrivers: array,
  handlePickUpDrivers: func,
  handleDropOffDrivers: func,
  disabled: bool,
};

DriversPicker.defaultProps = {
  isDriver: false,
  isCoDriver: false,
  isPickUp: false,
  isDropOff: false,
  additionalInfo: {},
  isLoadingPickUpDrivers: false,
  availablePickUpDrivers: [],
  isLoadingDropOffDrivers: false,
  availableDropOffDrivers: [],
  handlePickUpDrivers: () => {},
  handleDropOffDrivers: () => {},
  disabled: false,
};

export default DriversPicker;
