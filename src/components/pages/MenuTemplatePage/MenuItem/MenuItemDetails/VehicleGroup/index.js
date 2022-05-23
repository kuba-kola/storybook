import React, { useState } from "react";
import {
  func, number, arrayOf, bool, string,
} from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import Switch from "react-switch";
import cx from "classnames";
import { uniq, uniqBy } from "ramda";

import {
  getVehicleSets, saveVehicleGroup, setVehicleGroupsClipboard, removeVehicleGroup,
} from "store/actions/menu-template-actions";
import { vehicleSetPropType, menuItemTargetPropType } from "shared/prop-types";
import { servicesVehicleGroupsClipboardSelector } from "store/selectors/menu-template-selectors";
import { dealershipMakeModelYearMapSelector } from "store/selectors/app-selectors";
import { convertArrayToSelectOptions } from "shared/utils/common";

import "./styles.scss";

const ALL_MODELS = "All Models";

const VehicleGroup = ({
  vehicleGroup,
  forDefault,
  clipboardContent,
  makeModelYearMap,
  menuItemKind,
  menuItemId,
  hasPackageItems,
  fetchVehicleSets,
  copyVehicleGroup,
  saveVehicleGroup,
  removeVehicleGroup,
}) => {
  const [vehicleGroupData, setVehicleGroupData] = useState(vehicleGroup);
  const [isEditing, setIsEditing] = useState(!vehicleGroup.id);
  const [makeFilter, setMakeFilter] = useState(null);
  const [modelFilter, setModelFilter] = useState(null);
  const [fromYearFilter, setFromYearFilter] = useState(null);
  const [toYearFilter, setToYearFilter] = useState(null);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [isLoadingSets, setIsLoadingSets] = useState(false);

  const resetState = () => {
    setVehicleGroupData(vehicleGroup);
    setIsEditing(!vehicleGroup.id);
    setMakeFilter(null);
    setModelFilter(null);
    setFromYearFilter(null);
    setToYearFilter(null);
    setErrors({});
    setCopied(false);
    setIsLoadingSets(false);
  };

  const makeOptions = () => convertArrayToSelectOptions(Object.keys(makeModelYearMap));

  const modelOptions = (make) => (make ? convertArrayToSelectOptions([ALL_MODELS, ...Object.keys(makeModelYearMap[make] || {})]) : []);

  const yearOptions = (make, model) => {
    if (!make && !model) return [];
    if (!model || model === ALL_MODELS) {
      const allYears = Object.keys(makeModelYearMap[make]).reduce(
        (yearList, modelItem) => [
          ...yearList,
          ...makeModelYearMap[make][modelItem],
        ],
        [],
      );
      return convertArrayToSelectOptions(uniq(allYears).sort());
    }
    return convertArrayToSelectOptions(makeModelYearMap[make][model]);
  };

  const quickAdd = async () => {
    if (!makeFilter || !modelFilter) { return; }

    setIsLoadingSets(true);
    try {
      const vehicleSets = await fetchVehicleSets({
        make: makeFilter.value,
        model: modelFilter.value === ALL_MODELS ? null : modelFilter.value,
        model_year_from: fromYearFilter && fromYearFilter.value,
        model_year_to: toYearFilter && toYearFilter.value,
        with_id: true,
      });

      updateVehicleGroupState({
        vehicle_sets: uniqBy(({ id }) => id, [
          ...(vehicleGroup.vehicle_sets || []),
          ...(vehicleSets || []),
        ]),
      });
      setIsLoadingSets(false);
    } catch (error) {
      setIsLoadingSets(false);
      console.error(error);
    }
  };

  const handleVehicleSelect = (values) => {
    updateVehicleGroupState({ vehicle_sets: values.map(({ vehicleSet }) => vehicleSet) });
  };

  const edit = () => {
    setIsEditing(true);
    setCopied(false);
  };

  const save = () => {
    if (validate(vehicleGroupData)) {
      saveVehicleGroup(
        menuItemId, {
          ...vehicleGroupData,
        },
      );
      setIsEditing(false);
    }
  };

  const validate = (vehicleGroup) => {
    const errors = {
      priceInvalid: vehicleGroup.price < 0,
      savingInvalid: vehicleGroup.saving < 0,
      mileageRangeFromInvalid: !forDefault && (
        Number.isNaN(vehicleGroup.mileage_range[0])
        || vehicleGroup.mileage_range[0] === null
        || vehicleGroup.mileage_range[0] < 0
      ),
      mileageRangeToInvalid: !forDefault && (!vehicleGroup.mileage_range[1]
        || vehicleGroup.mileage_range[1] <= 0
        || vehicleGroup.mileage_range[1] < vehicleGroup.mileage_range[0]
      ),
      allocatedLaborTimeError: vehicleGroup.allocated_labor_time < 0,
      actualLaborTimeError: vehicleGroup.actual_labor_time < 0,
      expectedUpsellTimeError: vehicleGroup.expected_upsell_time < 0,
    };
    setErrors(errors);

    return !Object.values(errors).find((v) => v);
  };

  const updateVehicleGroupState = (values) => setVehicleGroupData((prevVehicleGroupData) => ({
    ...prevVehicleGroupData,
    ...values,
  }));

  const handleMileageFromChange = (event) => updateVehicleGroupState({
    mileage_range: [
      parseInt(event.target.value, 10),
      vehicleGroupData.mileage_range[1],
    ],
  });

  const handleMileageToChange = (event) => updateVehicleGroupState({
    mileage_range: [
      vehicleGroupData.mileage_range[0],
      parseInt(event.target.value, 10),
    ],
  });

  const handlePriceChange = (event) => updateVehicleGroupState({
    price: event.target.value !== "" ? Math.round(event.target.value * 100) / 100 : "",
  });

  const handleSavingChange = (event) => updateVehicleGroupState({
    saving: event.target.value !== "" ? Math.round(event.target.value * 100) / 100 : "",
  });

  const handleExcludeChange = (checked) => updateVehicleGroupState({ exclude_cars: checked });

  const mapForSelect = (vs) => ({ vehicleSet: vs, value: vs.id, label: `${vs.make} - ${vs.model} - ${vs.model_year}` });

  const copy = () => {
    setCopied(true);
    copyVehicleGroup({ ...vehicleGroupData, id: undefined });
  };

  // const paste = () => setVehicleGroupData(clipboardContent);
  // or this? check how remove of copied vehicle group functionality works
  const paste = () => setVehicleGroupData({ ...clipboardContent, id: vehicleGroup.id });

  return (
    <div className="vehicleGroup">
      <div className="vehicleGroupExcludeCarsSwitchContainer">
        <label className="vehicleGroupInputLabel" htmlFor="exclude-cars-switch">Exclude cars</label>
        <Switch
          id="exclude-cars-switch"
          className="vehicleGroupExcludeCarsSwitch"
          onChange={handleExcludeChange}
          disabled={!isEditing || isLoadingSets}
          checked={vehicleGroupData.exclude_cars}
          onColor="#36af5e"
          offColor="#dedee0"
          activeBoxShadow="0 0 2px 3px #0bcaf9"
          aria-labelledby="exclude-cars-label"
        />
      </div>
      <div className="vehicleGroupInputLabel vehicleGroupQuickAddLabel">Quick Add</div>
      <div className="vehicleGroupQuickAddContainer">
        <div className="vehicleGroupQuickAddFilters">
          <Select
            value={makeFilter}
            options={makeOptions()}
            onChange={(value) => setMakeFilter(value)}
            isDisabled={!isEditing || isLoadingSets}
            className="vehicleGroupInputDropdown"
            classNamePrefix="vehicleGroupInputDropdown"
            placeholder="Make"
          />
          <Select
            value={modelFilter}
            options={modelOptions((makeFilter || {}).value)}
            onChange={(value) => {
              setModelFilter(value);
              setFromYearFilter(null);
              setToYearFilter(null);
            }}
            isDisabled={!isEditing || isLoadingSets}
            className="vehicleGroupInputDropdown"
            classNamePrefix="vehicleGroupInputDropdown"
            placeholder="Model"
          />
          <Select
            value={fromYearFilter}
            options={yearOptions((makeFilter || {}).value, (modelFilter || {}).value)}
            onChange={(value) => setFromYearFilter(value)}
            isDisabled={!isEditing || isLoadingSets}
            className="vehicleGroupInputDropdown"
            classNamePrefix="vehicleGroupInputDropdown"
            placeholder="Year from"
          />
          <Select
            value={toYearFilter}
            options={yearOptions((makeFilter || {}).value, (modelFilter || {}).value)}
            onChange={(value) => setToYearFilter(value)}
            isDisabled={!isEditing || isLoadingSets}
            className="vehicleGroupInputDropdown"
            classNamePrefix="vehicleGroupInputDropdown"
            placeholder="Year to"
          />
        </div>
        <button
          type="button"
          className={cx("vehicleGroupQuickAddButton", { vehicleGroupQuickAddButtonDisabled: !isEditing })}
          onClick={quickAdd}
          disabled={!isEditing || isLoadingSets}
        >
          Add
        </button>
      </div>
      <div className="vehicleGroupInputContainer">
        <span className="vehicleGroupInputLabel">Cars</span>
        <Select
          isMulti
          value={vehicleGroupData.vehicle_sets.map(mapForSelect)}
          isSearchable={false}
          isDisabled={!isEditing || isLoadingSets}
          onChange={handleVehicleSelect}
          className={cx("vehicleGroupInputDropdown", "menuHidden", { error: errors.vehicleSetsInvalid })}
          classNamePrefix="vehicleGroupInputDropdown"
        />
        {errors.vehicleSetsInvalid && (
          <span className="vehicleGroupError">Can&apos;t be empty</span>
        )}
      </div>
      <div className="vehicleGroupInputWrapper">
        <div className="vehicleGroupInputContainer">
          <span className="vehicleGroupInputLabel">Mileage (in miles)</span>
          <div className="display-flex">
            <div className="display-flex-column">
              <span className="vehicleGroupInputRangeText">From:</span>
              <input
                type="number"
                className={cx("vehicleGroupInputTextInput", { error: errors.mileageRangeFromInvalid })}
                disabled={!isEditing || forDefault}
                value={vehicleGroupData.mileage_range[0]}
                onChange={handleMileageFromChange}
              />
              {errors.mileageRangeFromInvalid && (
                <span className="vehicleGroupError">Invalid value</span>
              )}
            </div>
            <div className="display-flex-column">
              <span className="vehicleGroupInputRangeText">To:</span>
              <input
                type="number"
                className={cx("vehicleGroupInputTextInput", { error: errors.mileageRangeToInvalid })}
                disabled={!isEditing || forDefault}
                value={vehicleGroupData.mileage_range[1]}
                onChange={handleMileageToChange}
              />
              {errors.mileageRangeToInvalid && (
                <span className="vehicleGroupError">Invalid value</span>
              )}
            </div>
          </div>
        </div>
        <div className="vehicleGroupInputContainer">
          <span className="vehicleGroupInputLabel">Price (in USD)</span>
          <input
            type="number"
            step="0.01"
            className={cx("vehicleGroupInputTextInput", { error: errors.priceInvalid })}
            disabled={!isEditing}
            value={vehicleGroupData.price}
            onChange={handlePriceChange}
          />
          {errors.priceInvalid && (
            <span className="vehicleGroupError">Invalid value</span>
          )}
        </div>
        {hasPackageItems && (
          <div className="vehicleGroupInputContainer">
            <span className="vehicleGroupInputLabel">Saving (in USD)</span>
            <input
              type="number"
              step="0.01"
              className={cx("vehicleGroupInputTextInput", { error: errors.savingInvalid })}
              disabled={!isEditing}
              value={vehicleGroupData.saving}
              min={0}
              onChange={handleSavingChange}
            />
            {errors.savingInvalid && (
              <span className="vehicleGroupError">Invalid value</span>
            )}
          </div>
        )}
        <div className="vehicleGroupInputSeparator">&nbsp;</div>
        <div className="vehicleGroupInputContainer">
          <span className="vehicleGroupInputLabel">Allocated time</span>
          <input
            type="number"
            step="0.1"
            min={0}
            className={cx("vehicleGroupInputTextInput", { error: errors.allocatedLaborTimeError })}
            disabled={!isEditing}
            value={vehicleGroupData.allocated_labor_time}
            onChange={({ target: { value } }) => +value >= 0 && updateVehicleGroupState({ allocated_labor_time: value })}
          />
          {errors.allocatedLaborTimeError && (
            <span className="vehicleGroupError">Invalid value</span>
          )}
        </div>
        <div className="vehicleGroupInputContainer">
          <span className="vehicleGroupInputLabel">Actual time</span>
          <input
            type="number"
            step="0.1"
            min={0}
            className={cx("vehicleGroupInputTextInput", { error: errors.actualLaborTimeError })}
            disabled={!isEditing}
            value={vehicleGroupData.actual_labor_time}
            onChange={({ target: { value } }) => +value >= 0 && updateVehicleGroupState({ actual_labor_time: value })}
          />
          {errors.actualLaborTimeError && (
            <span className="vehicleGroupError">Invalid value</span>
          )}
        </div>
        {/* <div className="vehicleGroupInputContainer">
          <span className="vehicleGroupInputLabel">Expected upsell item <i>(optional)</i></span>
          <input
            type="number"
            step="0.1"
            min={0}
            className={cx('vehicleGroupInputTextInput', { error: errors.expectedUpsellTimeError })}
            disabled={!isEditing}
            value={vehicleGroupData.expected_upsell_time}
            onChange={({ target: { value } }) => +value >= 0 && updateVehicleGroupState({ expected_upsell_time: value })}
          />
          {errors.expectedUpsellTimeError && (
            <span className="vehicleGroupError">Invalid value</span>
          )}
        </div> */}
      </div>

      {isEditing ? (
        <div className="vehicleGroupActionButtons">
          <button
            type="button"
            disabled={!vehicleGroupData.id}
            className="vehicleGroupActionButton vehicleGroupActionButton-delete vehicleGroupActionButton-marginLeft"
            onClick={() => removeVehicleGroup(menuItemKind, menuItemId, vehicleGroupData.id)}
          >
            Remove
          </button>
          <button
            type="button"
            className={cx("vehicleGroupActionButton", "vehicleGroupActionButton-marginLeft", {
              "vehicleGroupActionButton-success": copied,
            })}
            disabled={copied}
            onClick={copy}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          {clipboardContent && (
            <button
              type="button"
              className={cx("vehicleGroupActionButton", "vehicleGroupActionButton-marginLeft")}
              onClick={paste}
            >
              Paste
            </button>
          )}
          <button
            type="button"
            className="vehicleGroupActionButton vehicleGroupActionButton-marginLeft"
            onClick={resetState}
          >
            Cancel
          </button>
          <button
            type="button"
            className="vehicleGroupActionButton vehicleGroupActionButton-marginLeft"
            onClick={save}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="vehicleGroupActionButtons">
          <button
            type="button"
            className="vehicleGroupActionButton vehicleGroupActionButton-marginLeft"
            onClick={edit}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

VehicleGroup.propTypes = {
  menuItemId: number.isRequired,
  menuItemKind: string.isRequired,
  forDefault: bool.isRequired,
  vehicleGroup: menuItemTargetPropType.isRequired,
  vehicleSets: arrayOf(vehicleSetPropType),
  fetchVehicleSets: func.isRequired,
  saveVehicleGroup: func.isRequired,
  removeVehicleGroup: func.isRequired,
  copyVehicleGroup: func.isRequired,
  clipboardContent: menuItemTargetPropType,
  hasPackageItems: bool.isRequired,
};

VehicleGroup.defaultProps = {
  clipboardContent: null,
};

const mapStateToProps = (state) => ({
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
  clipboardContent: servicesVehicleGroupsClipboardSelector(state),
});

const actions = {
  copyVehicleGroup: setVehicleGroupsClipboard,
  fetchVehicleSets: getVehicleSets,
  saveVehicleGroup,
  removeVehicleGroup,
};

const VehicleGroupContainer = connect(mapStateToProps, actions)(VehicleGroup);

export default VehicleGroupContainer;
