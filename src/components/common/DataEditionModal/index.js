import React, { useState, useEffect } from "react";
import {
  func, string, arrayOf, object, bool, oneOfType,
} from "prop-types";
import cx from "classnames";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

import { customerFieldsPropType } from "shared/prop-types";
import closeIcon from "assets/images/close.svg";
import { renderDataEditionErrors } from "./helpers";

import "./styles.scss";

const DataEditionModal = ({
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
  loading,
  error,
  submitButtonText,
}) => {
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !loading && !error) {
      onClose();
    }
  }, [loading]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    if (!loading) {
      console.log(data);
      onSubmit(data);
    }
  };

  const handleLocationChange = (value) => {
    setData((data) => ({ ...data, address: value }));
  };

  const handleLocationSelect = (value) => {
    geocodeByAddress(value)
      .then((res) => {
        const formattedAddress = res[0].formatted_address;
        const addressComponents = res[0].address_components;
        console.log(addressComponents);
        const getAddressComponentByType = (components, type) => {
          for (let i = 0; i < components.length; i++) {
            if (components[i].types.indexOf(type) > -1) {
              return components[i].long_name;
            }
          }
        };

        const formated = {
          address: formattedAddress,
          address_line1: getAddressComponentByType(addressComponents, "street_number"),
          address_line2: getAddressComponentByType(addressComponents, "route"),
          address_city: getAddressComponentByType(addressComponents, "locality"),
          address_state: getAddressComponentByType(addressComponents, "administrative_area_level_1"),
          address_zipcode: getAddressComponentByType(addressComponents, "postal_code"),
        };

        setData((data) => ({ ...data, ...formated }));
      })
      .catch((error) => {
        console.warn(error);
        if (error || error.error_message) {
          setData((data) => ({ ...data, address: value, address_line1: value }));
        }
      });
  };

  const renderLocationInput = (field) => (
    <>
      <label
        htmlFor={field.id}
        id={field.id}
        key={field.id}
        className="dataEditionModalLabel"
      >
        {field.label}
      </label>
      <PlacesAutocomplete
        value={data.address}
        onChange={handleLocationChange}
        onSelect={handleLocationSelect}
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
          <div className="dataEditionModalInputWrapper">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                name: field.id,
                className: cx("dataEditionModalInput", {
                  additionalInfoItemLocationInputDisabled: false,
                }),
              })}
              // disabled={disabled}
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
    </>
  );

  return (
    <>
      <div className="dataEditionModal">
        <div className="dataEditionModalHeader">
          {title}
          <button
            type="button"
            className="dataEditionModalCloseButton"
            onClick={loading ? null : () => onClose()}
          >
            <img alt="close" src={closeIcon} />
          </button>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="dataEditionModalBody">
            {loading ? (
              <span className="dataEditionModalLoader font-ibm">
                Loading...
              </span>
            ) : (
              fields.map((field) => {
                if (field.id === "address") return renderLocationInput(field);

                return (
                  <label
                    htmlFor={field.id}
                    id={field.id}
                    key={field.id}
                    className="dataEditionModalLabel"
                  >
                    {field.label}
                    <input
                      {...field}
                      className="dataEditionModalInput"
                      name={field.id}
                      value={data[field.id]}
                      onChange={(e) => setData({ ...data, [field.id]: e.target.value })}
                    />
                  </label>
                );
              })
            )}
            {error && renderDataEditionErrors(error)}
          </div>
          {!loading && (
            <div className="dataEditionModalFooter">
              <button
                className="dataEditionModalCancel"
                type="button"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button className="dataEditionModalSave" type="submit">
                {submitButtonText}
              </button>
            </div>
          )}
        </form>
      </div>
      <button type="button" className="dataEditionAddTemplateOverlay" />
    </>
  );
};

DataEditionModal.propTypes = {
  onClose: func.isRequired,
  title: string.isRequired,
  fields: arrayOf(customerFieldsPropType).isRequired,
  // eslint-disable-next-line
  initialData: object,
  onSubmit: func.isRequired,
  loading: bool.isRequired,
  error: oneOfType([string, arrayOf(string)]).isRequired,
  submitButtonText: string,
};

DataEditionModal.defaultProps = {
  initialData: {},
  submitButtonText: "Create",
};

export default DataEditionModal;
