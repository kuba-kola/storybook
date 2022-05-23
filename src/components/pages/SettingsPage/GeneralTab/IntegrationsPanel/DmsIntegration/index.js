import React, { useState } from "react";
import { connect } from "react-redux";
import { identity } from "ramda";
import { func, arrayOf } from "prop-types";
import { formatIntegrationSettingName } from "shared/utils/common";
import {
  integrationPropType,
  serviceAdvisorPropType,
  dispatchCodePropType,
  printerPropType,
} from "shared/prop-types";
import {
  activeAdvisorsSelector,
  settingsDispatchCodesSelector,
  settingsLaborTypesSelector,
  settingsPrintersSelector,
} from "store/selectors/settings-selectors";
import { updateDmsIntegrationOptions } from "store/actions/settings-actions";
import Input from "components/common/Input";
import HeaderEdit from "components/common/HeaderEdit";
import ImportDatesInputs from "../ImportDatesInputs";
import DefaultSettingDropdown from "./DefaultSettingDropdown";

const KEYS_TO_SKIP = [
  "service_writer_id",
  "dispatch_code",
  "labor_type",
  "printer_id",
];
const keysToDisplay = (settings) => Object.keys(settings).filter((keyName) => (
  !KEYS_TO_SKIP.includes(keyName)));

const DmsIntegration = ({
  integration,
  updateIntegrationHandler,
  serviceAdvisors,
  dispatchCodes,
  laborTypes,
  printers,
  isSuperAdmin,
}) => {
  const {
    settings,
    id,
    kind,
    last_repair_order_import_date: repairOrderImportDate,
    last_appointment_import_date: appointmentImportDate,
  } = integration;
  const {
    service_writer_id, dispatch_code, labor_type, printer_id,
  } = settings;
  const [serviceWriterId, setServiceWriterId] = useState(service_writer_id);
  const [dispatchCode, setDispatchCode] = useState(dispatch_code);
  const [laborType, setLaborType] = useState(labor_type);
  const [printerId, setPrinterId] = useState(printer_id);
  const [isEditing, setIsEditing] = useState(false);
  const [integrationSettings, setIntegrationSettings] = useState(settings);

  const save = () => {
    const params = {
      settings: {
        service_writer_id: serviceWriterId,
        dispatch_code: dispatchCode,
        labor_type: laborType,
        printer_id: printerId,
      },
    };

    updateIntegrationHandler(id, isSuperAdmin ? { settings: integrationSettings } : params);
    setIsEditing(false);
  };

  const updateServiceWriter = (selectedWriterOption) => {
    setServiceWriterId(selectedWriterOption.value);
  };

  const updateDispatchCode = (selectedCodeOption) => {
    setDispatchCode(selectedCodeOption.value);
  };

  const updateLaborType = (selectedCodeOption) => {
    setLaborType(selectedCodeOption.value);
  };

  const updatePrinterId = (selectedPrinterOption) => {
    setPrinterId(selectedPrinterOption.value);
  };

  const cancelChanges = () => {
    setServiceWriterId(service_writer_id);
    setDispatchCode(dispatch_code);
    setLaborType(labor_type);
    setPrinterId(printer_id);
    setIntegrationSettings(settings);
    setIsEditing(false);
  };

  return (
    <section
      className="conciergeSettingsPageBlock conciergeSettingsPageIntegrationsBlock"
    >
      <section className="conciergeBlockTitle conciergeSettingsPageBlockTitle">
        <label>{kind}</label>
        <HeaderEdit
          isEditing={isEditing}
          handleCancel={cancelChanges}
          handleSave={save}
          handleEdit={() => setIsEditing(true)}
        />
      </section>
      <section className="conciergeBlockContent conciergeSettingsPageBlockContent">
        <div>
          <div className="conciergeSettingsPageIntegrationsBlockDropdownsContainer">
            {!isSuperAdmin && (
              <DefaultSettingDropdown
                collection={serviceAdvisors}
                idColumn="writer_id"
                nameColumn="name"
                dropdownLabel="Service Writer ID"
                dropdownKey="service_writer_id"
                selectedValue={serviceWriterId}
                updateHandler={updateServiceWriter}
                isDisabled={!isEditing}
              />
            )}
            {kind === "dealer_track" && !isSuperAdmin && (
              <DefaultSettingDropdown
                collection={printers}
                idColumn="printer_id"
                nameColumn="description"
                dropdownLabel="Default Printer"
                dropdownKey="printer_id"
                selectedValue={printerId}
                updateHandler={updatePrinterId}
                isDisabled={!isEditing}
              />
            )}
            {integration.kind === "cdk" && !isSuperAdmin && (
              <>
                <DefaultSettingDropdown
                  collection={dispatchCodes}
                  idColumn="code"
                  nameColumn="description"
                  dropdownLabel="Default Dispatch Code"
                  dropdownKey="dispatch_code"
                  selectedValue={dispatchCode}
                  updateHandler={updateDispatchCode}
                  isDisabled={!isEditing}
                />
                <DefaultSettingDropdown
                  collection={laborTypes}
                  idColumn="code"
                  nameColumn="description"
                  dropdownLabel="Default Labor Type"
                  dropdownKey="labor_type"
                  selectedValue={laborType}
                  updateHandler={updateLaborType}
                  isDisabled={!isEditing}
                />
              </>
            )}
          </div>
          <ImportDatesInputs
            repairOrderImportDate={repairOrderImportDate}
            appointmentImportDate={appointmentImportDate}
          />
        </div>
        <section className="conciergeSettingsPageIntegrationsBlockInputsPart">
          {keysToDisplay(integrationSettings).map((keyName) => (
            <Input
              label={formatIntegrationSettingName(keyName)}
              value={integrationSettings[keyName]}
              disabled={!isSuperAdmin || !isEditing}
              onChange={(value) => setIntegrationSettings({
                ...integrationSettings,
                [keyName]: value,
              })}
              key={keyName}
            />
          ))}
        </section>
      </section>
    </section>
  );
};

DmsIntegration.propTypes = {
  integration: integrationPropType.isRequired,
  updateIntegrationHandler: func.isRequired,
  serviceAdvisors: arrayOf(serviceAdvisorPropType).isRequired,
  dispatchCodes: arrayOf(dispatchCodePropType).isRequired,
  laborTypes: arrayOf(dispatchCodePropType).isRequired,
  printers: arrayOf(printerPropType).isRequired,
};

const mapStateToProps = (state) => ({
  serviceAdvisors: activeAdvisorsSelector(state),
  dispatchCodes: settingsDispatchCodesSelector(state),
  laborTypes: settingsLaborTypesSelector(state),
  printers: settingsPrintersSelector(state),
});

const actions = {
  updateIntegrationHandler: updateDmsIntegrationOptions,
};

export default connect(mapStateToProps, actions)(DmsIntegration);
