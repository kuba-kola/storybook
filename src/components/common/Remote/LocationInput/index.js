import React, { useState, useCallback, useEffect } from "react";
import { shape, bool, func } from "prop-types";
import cx from "classnames";
import { remoteAdditionalInfoJobPropType } from "components/common/Remote/propTypes";

import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

import checkedMarkIcon from "assets/images/bookings/checked-mark.svg";

const LocationInput = ({
  isPickUp,
  isDropOff,
  additionalInfo,
  additionalInfo: { pickUp, dropOff, isSameLocation },
  onChange,
  toggleIsSameLocation,
  disabled,
  isScheduler,
}) => {
  const [address, setAddress] = useState("");

  const onChangeLocationData = useCallback((data) => {
    if (isSameLocation) {
      onChange({
        pickUp: {
          ...pickUp,
          ...data,
        },
        dropOff: {
          ...dropOff,
          ...data,
        },
      });
    } else if (isPickUp) {
      onChange({
        pickUp: {
          ...pickUp,
          ...data,
        },
      });
    } else if (isDropOff) {
      onChange({
        dropOff: {
          ...dropOff,
          ...data,
        },
      });
    }
  }, [onChange, isSameLocation]);

  useEffect(() => {
    if (isSameLocation && isDropOff) {
      setAddress(pickUp.address);
    }
  }, [isSameLocation, additionalInfo]);

  useEffect(() => {
    if (isSameLocation) {
      setAddress(pickUp.address);
    } else if (isPickUp) {
      setAddress(pickUp.address);
    } else if (isDropOff) {
      setAddress(dropOff.address);
    }
  }, []);

  const labelLocation = () => {
    if (isPickUp) return "Pick-up Location";
    if (isDropOff) return "Drop-off Location";
    return "";
  };

  const handleSelect = (value) => {
    geocodeByAddress(value)
      .then((res) => {
        const formattedAddress = res[0].formatted_address;
        const addressComponents = res[0].address_components;

        const getAddressComponentByType = (components, type) => {
          for (let i = 0; i < components.length; i++) {
            if (components[i].types.indexOf(type) > -1) {
              return components[i].long_name;
            }
          }
        };

        const formated = {
          address: formattedAddress,
          addressData: {
            address_line1: getAddressComponentByType(addressComponents, "street_number"),
            address_line2: getAddressComponentByType(addressComponents, "route"),
            address_city: getAddressComponentByType(addressComponents, "locality"),
            address_state: getAddressComponentByType(addressComponents, "administrative_area_level_1"),
            address_zipcode: getAddressComponentByType(addressComponents, "postal_code"),
          },
        };

        setAddress(formattedAddress);
        onChangeLocationData(formated);
      });
  };

  const handleChange = (value) => {
    setAddress(value);

    if (value.length === 0) {
      onChangeLocationData({
        address: value,
        addressData: null,
      });
    }
  };

  return (
    <div className="additionalInfoItemColumn fullWidth">
      <div className="conciergeInputLabel">
        {labelLocation()}
      </div>
      <PlacesAutocomplete
        value={address}
        onChange={isSameLocation && isDropOff ? null : handleChange}
        onSelect={handleSelect}
        searchOptions={{
          types: ["address"],
          componentRestrictions: {
            country: ["us", "ca"],
          },
        }}
      >
        {({
          getInputProps, suggestions, getSuggestionItemProps, loading,
        }) => (
          <div className="additionalInfoItemLocationWrapper">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: cx("additionalInfoItemLocationInput", {
                  additionalInfoItemLocationInputDisabled: isSameLocation,
                }),
              })}
              disabled={disabled || (isSameLocation && isDropOff)}
            />
            {suggestions.length > 0 && (
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item suggestion-item--active"
                  : "suggestion-item";
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
      {isPickUp && !isScheduler && !disabled && (
        <div
          className="checkboxRow"
          onClick={toggleIsSameLocation}
        >
          <div
            className={cx("checkbox", {
              checkboxActive: isSameLocation,
            })}
          >
            <img
              className="checkedMarkIcon"
              src={checkedMarkIcon}
              alt="checkedMarkIcon"
            />
          </div>
          <p className="checkboxTitle">Same drop-off location</p>
        </div>
      )}
    </div>
  );
};

LocationInput.propTypes = {
  isPickUp: bool,
  isDropOff: bool,
  onChange: func.isRequired,
  toggleIsSameLocation: func.isRequired,
  additionalInfo: shape({
    pickUp: remoteAdditionalInfoJobPropType,
    dropOff: remoteAdditionalInfoJobPropType,
    isSameLocation: bool,
  }),
  disabled: bool,
  isScheduler: bool,
};

LocationInput.defaultProps = {
  isPickUp: false,
  isDropOff: false,
  additionalInfo: {},
  disabled: false,
  isScheduler: false,
};

export default LocationInput;
