import React, { useState } from "react";
import { connect } from "react-redux";
import { object, string, func } from "prop-types";
import { format } from "date-fns";

import { AMERICAN_DATE_FORMAT } from "shared/utils/datetime";
import { BOOKING_SOURCE, IMPORT_SOURCE, SCHEDULER_SOURCE } from "shared/constants";

import Panel from "components/common/Panel";
import Button from "components/common/Button";
import Input from "components/common/Input";
import editIcon from "assets/images/edit-light.svg";

import { updateLocalBooking } from "store/actions/booking-details-actions";
import { roTagNumberSelector } from "store/selectors/booking-details-selectors";
import ClientDetailsBlock from "./ClientDetailsBlock";
import VehicleDetailsBlock from "./VehicleDetailsBlock";
import "./styles.scss";

const BookingDetailsPanel = ({ booking, updateRoTagNumber }) => {
  const [isRoTagEditing, setIsRoTagEditing] = useState(false);
  const [displaySave, setDisplaySave] = useState(true);
  const [roTagNumber, setRoTagNumber] = useState(booking.repair_order_tag);
  const [isVehicleEditing, setIsVehicleEditing] = useState(false);
  const [isCustomerEditing, setIsCustomerEditing] = useState(false);
  const isRoCreated = !!booking.repair_order_number;
  const displayRoTag = !!booking.repair_order_tag;
  const saveRoTagNumber = () => {
    updateRoTagNumber({ repair_order_tag: roTagNumber });
    setIsRoTagEditing(false);
  };
  const handleChange = (value) => {
    const allowedRoTagNumberRegex = /^[0-9]*$/;
    if (value.length > 5 || !allowedRoTagNumberRegex.test(value)) {
      return;
    } if (value == "") {
      setDisplaySave(false);
    } else {
      setDisplaySave(true);
    }
    setRoTagNumber(value);
  };

  return (
    <Panel className="conciergeBookingDetailsPanelCard">
      <section className="conciergeBookingDetailsPanelRow">
        <VehicleDetailsBlock
          booking={booking}
          isEditing={isVehicleEditing}
          handleFieldEdit={setIsVehicleEditing}
        />
      </section>

      <section className="conciergeBookingDetailsPanelRepairOrderDetailsBlock">
        {isRoCreated && (
          <section className="conciergeBookingDetailsPanelRepairOrderDetailsBlockNumber">
            <span className="conciergeBookingDetailsPanelRepairOrderDetailsBlockLabel">RO number: </span>
            <span className="conciergeBookingDetailsPanelRepairOrderDetailsBlockText">{booking.repair_order_number}</span>
          </section>
        )}
        {displayRoTag && (
          <section className="conciergeBookingDetailsPanelRepairOrderDetailsBlockTag">
            <span className="conciergeBookingDetailsPanelRepairOrderDetailsBlockLabel">RO tag number:  </span>
            {
              isRoTagEditing ? (
                <>
                  <Input
                    inputClassName="conciergeBookingDetailsPanelRepairOrderDetailsBlockTagInput"
                    type="string"
                    value={roTagNumber}
                    onChange={(value) => handleChange(value)}
                  />
                  {
                    displaySave && (
                      <span className="conciergeBookingDetailsPanelRepairOrderDetailsBlockLabel conciergeBookingDetailsPanelRepairOrderDetailsBlockLabel--save" onClick={() => saveRoTagNumber()}>Save</span>
                    )
                  }
                </>
              )
                : (
                  <>
                    <span className="conciergeBookingDetailsPanelRepairOrderDetailsBlockText conciergeBookingDetailsPanelRepairOrderDetailsBlockText--repair-order-tag" onClick={() => setIsRoTagEditing(true)}>{roTagNumber}</span>
                  </>
                )
            }
          </section>
        )}
      </section>
      <section className="conciergeBookingDetailsPanelRow">
        <section className="conciergeVehicleDetailsBlock">
          <section className="conciergeBookingDetailsBlock">
            <div className="conciergeBookingDetailsPanelCreatedAt">
              {booking.creation_date && (<BookingCreatedAt creation_date={booking.creation_date} />)}
            </div>
            <div className="conciergeBookingDetailsPanelCreatedBy">
              {booking.created_by && (<BookingCreatedBy source={booking.created_by.source} creator_name={booking.created_by.created_by_name} />)}
            </div>
          </section>

          {!isRoCreated && (
          <Button
            onClick={() => setIsVehicleEditing(!isVehicleEditing)}
            className="conciergeClientDetailsBlockActionButton conciergeClientDetailsBlockActionButton-edit"
          >
            <img
              src={editIcon}
              alt="concierge edit light"
              className="conciergeClientDetailsBlockIcon conciergeClientDetailsBlockIcon-edit"
            />
            Edit
          </Button>
          )}
        </section>
      </section>
      <section className="conciergeBookingDetailsPanelRow">
        <ClientDetailsBlock
          booking={booking}
          isEditing={isCustomerEditing}
          handleFieldEdit={setIsCustomerEditing}
        />
      </section>
    </Panel>
  );
};

BookingDetailsPanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
  updateRoTagNumber: func.isRequired,
};

BookingDetailsPanel.defaultProps = {
  booking: null,
};

const BookingCreatedBy = ({ source, creator_name }) => (
  <section>
    <span className="conciergeBookingDetailsPanelCreatedLabel">{createdByLabel(source, creator_name)}</span>
  </section>
);

const BookingCreatedAt = ({ creation_date }) => (
  <section className="conciergeBookingDetailsPanelCreated">
    <span className="conciergeBookingDetailsPanelCreatedLabel">Booking created: </span>
    <span className="conciergeBookingDetailsPanelCreatedTime">{format(creation_date, AMERICAN_DATE_FORMAT)}</span>
  </section>
);

const createdByLabel = (source, creator_name) => {
  switch (source) {
    case BOOKING_SOURCE:
      return "Made by customer";
    case IMPORT_SOURCE:
      return "Imported";
    case SCHEDULER_SOURCE:
      if (creator_name !== null) {
        return `Made by ${creator_name}`;
      }
      return "Made in scheduler";

    default:
      return null;
  }
};

BookingCreatedAt.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  creation_date: string,
};

BookingCreatedBy.propTypes = {
  source: string,
  creator_name: string,
};

BookingCreatedAt.defaultProps = {
  creation_date: null,
};

const mapStateToProps = (state) => ({
  roTagNumber: roTagNumberSelector(state),
});

const actions = {
  updateRoTagNumber: updateLocalBooking,
};

export default connect(mapStateToProps, actions)(BookingDetailsPanel);
