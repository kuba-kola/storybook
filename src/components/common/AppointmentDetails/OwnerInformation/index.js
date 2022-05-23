import React from "react";

import { bool, number } from "prop-types";
import { vehiclePropType, customerPropType } from "shared/prop-types";

const OwnerInformation = ({
  customer: { first_name, last_name },
  vehicle: { vehicle_set, image, mileage },
  sendSms,
  contactNumber,
}) => (
  <>
    <div className="appointmentDetailsSection appointmentDetailsOwner">
      {image?.url && <img src={image.url} alt="" className="appointmentDetailsCarImg" />}
      <div className="appointmentDetailsOwnerWrapper">
        <span className="appointmentDetailsOwnerInfo">
          {`${first_name} ${last_name}`}
        </span>
        <span className="appointmentDetailsCarInfo">
          {`${vehicle_set?.model_year}, ${vehicle_set?.make} ${vehicle_set?.model}`}
        </span>
        <span className="appointmentDetailsCarInfo">
          {`Mileage: ${mileage}`}
        </span>
        <span className="appointmentDetailsContactInfo">
          {sendSms === true ? `Phone: ${contactNumber}` : "No SMS"}
        </span>
      </div>
    </div>
  </>
);

OwnerInformation.propTypes = {
  vehicle: vehiclePropType,
  customer: customerPropType,
  sendSms: bool.isRequired,
  contactNumber: number.isRequired,
};

OwnerInformation.defaultProps = {
  vehicle: {},
  customer: {},
};

export default OwnerInformation;
