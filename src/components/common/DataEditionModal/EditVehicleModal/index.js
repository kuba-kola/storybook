import React, { useState, useEffect, useCallback } from "react";
import {
  func, string, arrayOf, object, bool, oneOfType,
} from "prop-types";
import { isEmpty, uniq } from "ramda";
import StyledSelect from "components/common/StyledSelect";
import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";
import { customerFieldsPropType } from "shared/prop-types";
import { isMakeModelValid, convertArrayToSelectOptions } from "shared/utils/common";
import { fetchCdkModelCodeSuggestions } from "shared/api";
import {
  retrieveCdkModelCodeByVin,
  retrieveVehicleSetByVin,
  resetVehicleSetByVin,
} from "store/actions/app-actions";
import {
  resetDataEditionState,
} from "store/actions/scheduling-actions";
import "../styles.scss";
import { connect } from "react-redux";
import {
  cdkModelCodeByVinSelector,
  dealershipIdSelector,
  vehicleSetByVinErrorSelector,
  vehicleSetByVinLoadingSelector,
  vehicleSetByVinSelector,
} from "store/selectors/app-selectors";
import { dmsTypeSelector } from "store/selectors/settings-selectors";
import { authTokenSelector } from "store/selectors/auth-selectors";
import Button from "components/common/Button";
import Modal from "components/common/Modal";
import { renderDataEditionErrors } from "../helpers";

const EditVehicleModal = ({
  onClose,
  title,
  fields,
  initialData,
  defaultMake,
  onSubmit,
  loading,
  error,
  submitButtonText,
  makeModelYearMap,
  cdkModelCodeByVin,
  fetchCdkModelCodeByVin,
  fetchVehicleSetByVin,
  resetVehicleSetByVin,
  resetDataEditionState,
  vehicleSetByVin,
  vehicleSetByVinLoading,
  vehicleSetByVinError,
  dmsType,
  dealershipId,
  token,
}) => {
  const [data, setData] = useState(initialData);
  const [vinVerified, setVinVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!initialData.make && defaultMake) {
      setData((data) => ({
        ...data,
        make: defaultMake,
      }));
    }
  }, []);

  useEffect(() => {
    if (!vehicleSetByVin) return;
    const { make, model, model_year } = vehicleSetByVin;
    if (submitted && (
      data.make !== make || data.model !== model || data.model_year !== model_year
    )) {
      setValidationError("Data mismatch, please verify vin.");
      setSubmitted(false);
      reset();
      return;
    }
    setVinVerified(true);
    setData((data) => ({
      ...data,
      make,
      model,
      model_year,
    }));
  }, [vehicleSetByVin]);

  useEffect(() => {
    if (!cdkModelCodeByVin) return;
    setData((data) => ({
      ...data,
      external_model_code: cdkModelCodeByVin,
    }));
  }, [cdkModelCodeByVin]);

  useEffect(() => {
    setValidationError("");
    setSubmitted(false);
  }, [data]);

  const promisedOptions = (inputValue) => {
    if (inputValue.length < 2) return [];
    return new Promise((resolve, reject) => {
      fetchCdkModelCodeSuggestions(
        dealershipId,
        {
          dealership_id: dealershipId,
          model_description: inputValue,
        },
        token,
      )
        .then((data) => resolve(data.map(({ model_code, model_description }) => ({
          label: model_description,
          value: model_code,
        }))))
        .catch((error) => console.warn(error));
    });
  };

  const handleChange = (type, value) => {
    setValidationError("");
    switch (type) {
      case "make": {
        setData((data) => ({
          ...data,
          make: value,
          model: null,
          model_year: null,
        }));
        break;
      }
      case "model": {
        setData((data) => ({
          ...data,
          model: value,
          model_year: null,
        }));
        break;
      }
      case "model_year": {
        setData((data) => ({
          ...data,
          model_year: value,
        }));
        break;
      }
      case "external_model_code": {
        setData((data) => ({
          ...data,
          external_model_code: value,
        }));
        break;
      }
      default:
        break;
    }
  };

  const getValues = useCallback(
    (type) => {
      if (!makeModelYearMap || isEmpty(makeModelYearMap)) return [];
      const { make, model, model_year } = data;

      switch (type) {
        case "make":
          return Object.keys(makeModelYearMap);
        case "model": {
          if (!isMakeModelValid(make) || !makeModelYearMap[make]) return [];
          if (isMakeModelValid(make) && model_year) {
            return Object.keys(makeModelYearMap[make] || {})
              .filter((model) => makeModelYearMap[make][model].includes(model_year));
          }
          return Object.keys(makeModelYearMap[make]);
        }
        case "model_year": {
          if ((!isMakeModelValid(make) && !isMakeModelValid(model)) || !makeModelYearMap[make]) return [];
          if (!isMakeModelValid(model)) {
            const allYears = Object.keys(makeModelYearMap[make]).reduce(
              (yearList, modelItem) => [
                ...yearList,
                ...makeModelYearMap[make][modelItem],
              ],
              [],
            );
            return uniq(allYears).sort().reverse();
          }
          return makeModelYearMap[make][model];
        }
        default:
          break;
      }
    },
    [data, makeModelYearMap],
  );

  const handleVinLookup = (vin) => {
    fetchVehicleSetByVin(vin);
    fetchCdkModelCodeByVin(vin);
  };

  const reset = () => {
    resetVehicleSetByVin();
    resetDataEditionState();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (submitted && !loading && !error) {
      handleClose();
    }
  }, [loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isMakeModelValid(data.make) || !isMakeModelValid(data.model) || !data.make || !data.model || !data.model_year) {
      return setValidationError("Make Model and Model Year are required.");
    }

    setSubmitted(true);
    // check vin before submit
    if (!vinVerified && data.vin) fetchVehicleSetByVin(data.vin);

    if (!loading && !validationError) {
      console.log(data);
      onSubmit(data);
    }
  };

  const renderVin = (field) => (
    <label
      htmlFor={field.id}
      id={field.id}
      key={field.id}
      className="dataEditionModalLabel"
    >
      <span>{field.label}</span>
      <div className="dataEditionModalInputGroup">
        <input
          {...field}
          className="dataEditionModalInput"
          name={field.id}
          value={data[field.id]}
          onChange={(e) => {
            setVinVerified(false);
            setValidationError("");
            setData({ ...data, [field.id]: e.target.value.trim() });
          }}
        />
        <button
          type="button"
          className="dataEditionModalInputButton"
          onClick={() => handleVinLookup(data[field.id])}
          disabled={(data[field.id] && data[field.id].length === 0) || vehicleSetByVinLoading}
        >
          Verify
        </button>
      </div>
    </label>
  );

  const renderMakeModelYear = (fields) => fields.map((field) => (
    <label
      htmlFor={field.id}
      id={field.id}
      key={field.id}
      className="dataEditionModalLabel"
    >
      {field.label}
      <StyledSelect
        value={{
          label: data[field.id],
          value: data[field.id],
        }}
        options={convertArrayToSelectOptions(getValues(field.id))}
        className="dataEditionModalSelect"
        onChange={({ value }) => handleChange(field.id, value)}
      />
    </label>
  ));

  const renderCdkModelCode = (field) => (
    <label
      htmlFor={field.id}
      id={field.id}
      key={field.id}
      className="dataEditionModalLabel"
    >
      {field.label}
      <AsyncCreatableSelect
        className="modelCodeSelectContainer"
        classNamePrefix="modelCodeSelect"
        placeholder="Select or create"
        cacheOptions
        value={{
          label: data[field.id],
          value: data[field.id],
        }}
        onChange={({ value }) => handleChange(field.id, value)}
        loadOptions={promisedOptions}
        menuPlacement="top"
      />
    </label>
  );

  return (
    <Modal
      title={title}
      size="small"
      isForm
      loading={loading}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      onCancel={handleClose}
      onSubmit={handleSubmit}
    >
      <div className="dataEditionModalBody">
        {loading ? (
          <span className="dataEditionModalLoader font-ibm">
            Loading...
          </span>
        ) : (
          fields.map((field) => {
            if (field.id === "external_model_code") {
              if (dmsType !== "cdk") return null;
              return renderCdkModelCode(field);
            }
            if (field.id === "vin") return renderVin(field);

            if (field.id === "makeModelYear") {
              return (
                <div className="dataEditionModalMakeModelYearRow">
                  {renderMakeModelYear(field.items)}
                </div>
              );
            }

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
                  onChange={(e) => {
                    setValidationError("");
                    setData({ ...data, [field.id]: e.target.value });
                  }}
                />
              </label>
            );
          })
        )}
        {error && renderDataEditionErrors(error)}
        {validationError && renderDataEditionErrors(validationError)}
        {vehicleSetByVinError && renderDataEditionErrors(vehicleSetByVinError)}
      </div>
    </Modal>
  );
};

EditVehicleModal.propTypes = {
  handleClose: func.isRequired,
  title: string.isRequired,
  fields: arrayOf(customerFieldsPropType).isRequired,
  // eslint-disable-next-line
  initialData: object,
  onSubmit: func.isRequired,
  loading: bool.isRequired,
  error: oneOfType([string, arrayOf(string)]),
  submitButtonText: string,
  dmsType: string,
};

EditVehicleModal.defaultProps = {
  initialData: {},
  submitButtonText: "Create",
  error: null,
  dmsType: null,
};

const mapStateToProps = (state) => ({
  vehicleSetByVin: vehicleSetByVinSelector(state),
  vehicleSetByVinLoading: vehicleSetByVinLoadingSelector(state),
  vehicleSetByVinError: vehicleSetByVinErrorSelector(state),
  cdkModelCodeByVin: cdkModelCodeByVinSelector(state),
  dmsType: dmsTypeSelector(state),
  dealershipId: dealershipIdSelector(state),
  token: authTokenSelector(state),
});

export default connect(mapStateToProps, {
  fetchVehicleSetByVin: retrieveVehicleSetByVin,
  fetchCdkModelCodeByVin: retrieveCdkModelCodeByVin,
  resetVehicleSetByVin,
  resetDataEditionState,
})(EditVehicleModal);
