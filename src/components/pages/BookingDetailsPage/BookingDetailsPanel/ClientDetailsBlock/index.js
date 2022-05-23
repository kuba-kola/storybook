import React from "react";
import { bool, func, object } from "prop-types";
import Button from "components/common/Button";
import { customerFieldsCDK, customerFieldsDT } from "shared/fields";
import {
  bookingDetailsDataModalSavingSelector,
  bookingDetailsDataModalSavingErrorSelector,
} from "store/selectors/booking-details-selectors";
import { updateCustomerData, createCustomer } from "store/actions/booking-details-actions";
import { dmsTypeSelector } from "store/selectors/settings-selectors";
import { connect } from "react-redux";

import editIcon from "assets/images/edit-light.svg";
import "./styles.scss";
import DataEditionModal from "components/common/DataEditionModal";

const ClientDetailsBlock = ({
  booking,
  dmsType,
  isEditing,
  dataEditionModalSaving,
  dataEditionModalSavingError,
  handleFieldEdit,
  saveEditedCustomerData,
  createCustomer,
}) => (
  <section className="conciergeClientDetailsBlock">
    <div className="conciergeClientDetailsBlockGroup">
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">Customer</div>
        <div className="conciergeClientDetailsBlockValue">
          {booking?.customer
            ? `${booking?.customer?.first_name} ${booking?.customer?.last_name}`
            : "-"}
        </div>
      </div>
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">Phone</div>
        <div className="conciergeClientDetailsBlockValue">
          {booking?.customer?.phone_number || "-"}
        </div>
      </div>
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">Email</div>
        <div className="conciergeClientDetailsBlockValue">
          {booking?.customer?.email || "-"}
        </div>
      </div>
    </div>
    <div className="conciergeClientDetailsBlockGroup">
      <div className="conciergeClientDetailsBlockItem">
        <div className="conciergeClientDetailsBlockLabel">Address</div>
        <div className="conciergeClientDetailsBlockValue">
          {booking?.customer?.address || "-"}
        </div>
      </div>
      <div className="conciergeClientDetailsBlockItem">
        <Button
          onClick={() => handleFieldEdit(true)}
          className="conciergeClientDetailsBlockActionButton conciergeClientDetailsBlockActionButton-edit"
        >
          <img
            src={editIcon}
            alt="concierge edit light"
            className="conciergeClientDetailsBlockIcon conciergeClientDetailsBlockIcon-edit"
          />
          Edit
        </Button>
      </div>
    </div>
    {isEditing && (
    <DataEditionModal
      onClose={() => handleFieldEdit(false)}
      title="Add customer data"
      fields={
            dmsType === "dealer_track" ? customerFieldsDT : customerFieldsCDK
          }
      onSubmit={(data) => (booking.customer == null ? createCustomer(data, booking.id) : saveEditedCustomerData(data, booking.customer))}
      initialData={{
        first_name: booking?.customer?.first_name || "",
        last_name: booking?.customer?.last_name || "",
        phone_number: booking?.customer?.phone_number || "",
        email: booking?.customer?.email || "",
        address: booking?.customer?.address || "",
      }}
      submitButtonText="Save"
      loading={dataEditionModalSaving}
      error={dataEditionModalSavingError}
    />
    )}
  </section>
);

ClientDetailsBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  booking: object,
  // eslint-disable-next-line react/forbid-prop-types
  isEditing: bool,
  // eslint-disable-next-line react/forbid-prop-types
  handleFieldEdit: func,
};

ClientDetailsBlock.defaultProps = {
  booking: null,
  isEditing: null,
  handleFieldEdit: null,
};

const mapStateToProps = (state) => ({
  dataEditionModalSaving: bookingDetailsDataModalSavingSelector(state),
  dataEditionModalSavingError: bookingDetailsDataModalSavingErrorSelector(
    state,
  ),
  dmsType: dmsTypeSelector(state),
});

export default connect(mapStateToProps, {
  saveEditedCustomerData: updateCustomerData,
  createCustomer,
})(ClientDetailsBlock);
