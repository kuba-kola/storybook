import React from "react";
import { bool, func, string } from "prop-types";
import Block from "components/common/Block";
import Input from "components/common/Input";

const PersonalDetailsBlock = ({
  isEditing,
  onCustomerChange,
  customerName,
  customerEmail,
  customerPhone,
}) => (
  <Block title="Personal details" className="conciergeBookingDetailsPanelHalfPart">
    <Input
      label="Full name"
      disabled={!isEditing}
      onChange={(value) => onCustomerChange("customerName", value)}
      value={customerName}
    />
    <Input
      label="Email"
      disabled={!isEditing}
      onChange={(value) => onCustomerChange("customerEmail", value)}
      value={customerEmail}
    />
    <Input
      label="Phone number"
      disabled={!isEditing}
      onChange={(value) => onCustomerChange("customerPhone", value)}
      value={customerPhone}
    />
  </Block>
);

PersonalDetailsBlock.propTypes = {
  isEditing: bool,
  onCustomerChange: func,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
};

PersonalDetailsBlock.defaultProps = {
  isEditing: false,
  onCustomerChange: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

export default PersonalDetailsBlock;
