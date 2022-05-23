import React from "react";
import { string } from "prop-types";
import Block from "components/common/Block";

const CustomerNotesBlock = ({ note }) => (
  <Block title="Customer notes">
    {
      note
        ? (
          <div className="conciergeBookingDetailsPanelHalfPart">
            <p className="conciergeBookingDetailsLabel">Customer says</p>
            <p className="conciergeBookingDetailsValue conciergeBookingDetailsValue-notTransformed">{note}</p>
          </div>
        )
        : <p>Customer did not leave any notes</p>
    }
  </Block>
);

CustomerNotesBlock.propTypes = {
  note: string,
};

CustomerNotesBlock.defaultProps = {
  note: null,
};

export default CustomerNotesBlock;
