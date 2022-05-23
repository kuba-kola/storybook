import React from "react";
import { format } from "date-fns";
import { object, bool, string } from "prop-types";
import { imageUrl } from "shared/utils/common";
import { updateVehicleFields } from "shared/fields";

import { APPOINTMENT_DATETIME_FORMAT } from "shared/utils/datetime";

import "./styles.scss";
import { connect } from "react-redux";
import {
  bookingDetailsDataModalSavingSelector,
  bookingDetailsDataModalSavingErrorSelector,
} from "store/selectors/booking-details-selectors";
import {
  updateVehicleSetData,
} from "store/actions/booking-details-actions";
import EditVehicleModal from "components/common/DataEditionModal/EditVehicleModal";
import { dealershipMakeModelYearMapSelector } from "store/selectors/app-selectors";
import { dmsTypeSelector, settingsDefaultMakeSelector } from "store/selectors/settings-selectors";

const VehicleDetailsBlock = ({
  booking,
  isEditing,
  handleFieldEdit,
  saveVehicleData,
  makeModelYearMap,
  dataEditionModalSaving,
  dataEditionModalSavingError,
  defaultMake,
  dmsType,
}) => (
  <section className="conciergeVehicleDetailsBlock">
    {booking && booking.vehicle && booking.vehicle.image.url ? (
      <img
        className="conciergeVehicleDetailsBlockImage"
        src={imageUrl(booking.vehicle.image)}
        alt=""
      />
    ) : (
      <p className="conciergeVehicleDetailsBlockNoImageText">
        No vehicle image
      </p>
    )}
    <div className="conciergeVehicleDetailsBlockGroup">
      <div>
        <div className="conciergeVehicleDetailsBlockModelName">
          {`${booking?.vehicle_set?.model_year} ${booking?.vehicle_set?.make} ${booking?.vehicle_set?.model}`}
        </div>
        <div className="conciergeVehicleDetailsBlockBookingDetails">
          {format(booking?.appointment_datetime, APPOINTMENT_DATETIME_FORMAT)}
        </div>

      </div>
      {dmsType === "cdk" && booking?.vehicle?.external_model_code && (
      <div>
        <div className="conciergeVehicleDetailsBlockLabel">Model code:</div>
        <div className="conciergeVehicleDetailsBlockModelName">
          {booking?.vehicle?.external_model_code}
        </div>
      </div>
      )}
    </div>
    <div className="conciergeVehicleDetailsBlockGroup">
      <div>
        <div className="conciergeVehicleDetailsBlockLabel">VIN</div>
        <div className="conciergeVehicleDetailsBlockValue">
          {booking?.vehicle?.vin || "-"}
        </div>
      </div>
      <div>
        <div className="conciergeVehicleDetailsBlockLabel">Mileage</div>
        <div className="conciergeVehicleDetailsBlockValue">
          {booking?.vehicle?.mileage || "-"}
        </div>
      </div>
    </div>
    {isEditing && (
    <EditVehicleModal
      onClose={() => handleFieldEdit(false)}
      title="Add vehicle data"
      initialData={{ ...booking?.vehicle_set, ...booking?.vehicle, id: booking?.vehicle?.id }}
      fields={updateVehicleFields}
      onSubmit={(data) => saveVehicleData(data)}
      submitButtonText="Update"
      loading={dataEditionModalSaving}
      error={dataEditionModalSavingError}
      makeModelYearMap={makeModelYearMap}
      defaultMake={defaultMake}
    />
    )}
  </section>
);

VehicleDetailsBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
  isEditing: bool,
  isEditable: bool,
  defaultMake: string,
};

VehicleDetailsBlock.defaultProps = {
  booking: null,
  isEditing: false,
  isEditable: false,
};

const mapStateToProps = (state) => ({
  dataEditionModalSaving: bookingDetailsDataModalSavingSelector(state),
  dataEditionModalSavingError: bookingDetailsDataModalSavingErrorSelector(
    state,
  ),
  makeModelYearMap: dealershipMakeModelYearMapSelector(state),
  dmsType: dmsTypeSelector(state),
  defaultMake: settingsDefaultMakeSelector(state),
});

export default connect(mapStateToProps, {
  saveVehicleData: updateVehicleSetData,
})(VehicleDetailsBlock);
