import React from "react";
import { string } from "prop-types";
import { format } from "date-fns";

import { APPOINTMENT_DATETIME_FORMAT } from "shared/utils/datetime";

const PickupInformation = ({
  address,
  collectionTime,
}) => (
  <>
    <div className="appointmentDetailsData">
      <div className="appointmentDetailsDataItem">
        <div className="appointmentDetailsDataTitle">
          Location
        </div>
        <div className="appointmentDetailsDataContent">
          {address}
        </div>
      </div>
      <div className="appointmentDetailsDataItem">
        <div className="appointmentDetailsDataTitle">
          Collection Time
        </div>
        <div className="appointmentDetailsDataContent">
          {format(`${collectionTime.date}T${collectionTime.time}`, APPOINTMENT_DATETIME_FORMAT)}
        </div>
      </div>
    </div>
    <div className="appointmentDetailsDivider" />
  </>
);

PickupInformation.propTypes = {
  address: string.isRequired,
  collectionTime: string.isRequired,
};

export default PickupInformation;
