import React from "react";
import { string } from "prop-types";
import { formatMenuTemplateDate } from "shared/utils/datetime";
import Input from "components/common/Input";

const ImportDatesInputs = ({ repairOrderImportDate, appointmentImportDate }) => (
  <>
    <div className="conciergeSettingsPageIntegrationsBlockInputsPart">
      <Input
        label="Last Repair Orders Import Date"
        value={formatMenuTemplateDate(repairOrderImportDate)}
        disabled
        key="last_repair_order_dealer_track_import_date"
      />
      <Input
        label="Last Appointments Import Date"
        value={formatMenuTemplateDate(appointmentImportDate)}
        disabled
        key="last_appointment_dealer_track_import_date"
      />
    </div>
  </>
);

ImportDatesInputs.propTypes = {
  repairOrderImportDate: string,
  appointmentImportDate: string,
};

ImportDatesInputs.defaultProps = {
  repairOrderImportDate: "",
  appointmentImportDate: "",
};

export default ImportDatesInputs;
