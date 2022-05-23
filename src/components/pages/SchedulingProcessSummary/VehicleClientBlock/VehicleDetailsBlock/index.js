import React from "react";
import { object } from "prop-types";
import { format } from "date-fns";
import { imageUrl } from "shared/utils/common";

import { timeInUSFormat } from "shared/utils/datetime";

import "./styles.scss";

const VehicleDetailsBlock = ({
  vehicle,
  time: { quarterSlot, day: { full_date } },
}) => (
  <section className="conciergeVehicleDetailsBlock">
    {vehicle && vehicle.image.url ? (
      <img className="conciergeVehicleDetailsBlockImage" src={imageUrl(vehicle.image)} alt="" />
    ) : (
      <p className="conciergeVehicleDetailsBlockNoImageText">
        No vehicle image
      </p>
    )}
    <div className="conciergeVehicleDetailsBlockGroup">
      <div>
        <div className="conciergeVehicleDetailsBlockModelName">
          {vehicle?.vehicle_set?.model_year}
          {" "}
          {vehicle?.vehicle_set?.make}
          {" "}
          {vehicle?.vehicle_set?.model}
        </div>
        <div className="conciergeVehicleDetailsBlockBookingDetails">
          {format(full_date, "MM/DD/YY")}
          {" "}
          {timeInUSFormat(quarterSlot)}
        </div>
      </div>
    </div>
    <div>
      <div className="conciergeVehicleDetailsBlockGroup">
        <div>
          <div className="conciergeVehicleDetailsBlockLabel">
            VIN
          </div>
          <div className="conciergeVehicleDetailsBlockValue">
            {vehicle?.vin || "-"}
          </div>
        </div>
        <div>
          <div className="conciergeVehicleDetailsBlockLabel">
            Mileage
          </div>
          <div className="conciergeVehicleDetailsBlockValue">
            {vehicle?.mileage || "-"}
          </div>
        </div>
      </div>
    </div>
  </section>
);

VehicleDetailsBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  vehicle: object,
  // eslint-disable-next-line react/forbid-prop-types
  time: object,
};

VehicleDetailsBlock.defaultProps = {
  vehicle: null,
  time: null,
};

export default VehicleDetailsBlock;
