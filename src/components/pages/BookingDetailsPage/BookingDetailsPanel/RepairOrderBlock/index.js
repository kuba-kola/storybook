import React from "react";
import {
  shape, number, object, string,
} from "prop-types";
import Block from "components/common/Block";

const RepairOrderBlock = ({ repairOrderInfo }) => (
  <Block title="Repair order">
    {
      repairOrderInfo
        ? (
          <section className="conciergeBookingDetailsDataContainer conciergeBookingDetailsDataContainer-justifyEnd">
            <div className="conciergeBookingDetailsPanelHalfPart">
              <p className="conciergeBookingDetailsLabel">Repair order ID</p>
              <p className="conciergeBookingDetailsValue">{repairOrderInfo.repair_order_number}</p>
            </div>
            {/* commented sections below will be used when the data for them will be available */}
            {/* <div className="conciergeBookingDetailsPanelHalfPart">
            <p className="conciergeBookingDetailsLabel">Open RO Value</p>
            <p className="conciergeBookingDetailsValue">?</p>
          </div> */}
            <div className="conciergeBookingDetailsPanelHalfPart">
              <p className="conciergeBookingDetailsLabel">Payment status</p>
              <p className="conciergeBookingDetailsValue">?</p>
            </div>
            {/* <div className="conciergeBookingDetailsPanelHalfPart">
            <p className="conciergeBookingDetailsLabel">Closed RO Value</p>
            <p className="conciergeBookingDetailsValue">?</p>
          </div>
          <div className="conciergeBookingDetailsPanelHalfPart">
            <p className="conciergeBookingDetailsLabel">Requested value</p>
            <p className="conciergeBookingDetailsValue">?</p>
          </div> */}
          </section>
        )
        : <p>Current booking does not contain Repair order.</p>
    }
  </Block>
);

RepairOrderBlock.propTypes = {
  repairOrderInfo: shape({
    id: number.isRequired,
    fetched_details: object,
    repair_order_number: string.isRequired,
  }),
};

RepairOrderBlock.defaultProps = {
  repairOrderInfo: null,
};

export default RepairOrderBlock;
