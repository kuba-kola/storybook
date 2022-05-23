import React from "react";
import { object } from "prop-types";
import Block from "components/common/Block";

const ClientTransportBlock = ({ transportInfo }) => (
  <Block title="Client transport">
    {
      transportInfo
        ? (
          <section className="conciergeBookingDetailsDataContainer">
            <div className="conciergeBookingDetailsPanelHalfPart">
              <p className="conciergeBookingDetailsLabel">Selected means</p>
              <p className="conciergeBookingDetailsValue">{transportInfo.kind}</p>
            </div>
            <div className="conciergeBookingDetailsPanelHalfPart">
              <p className="conciergeBookingDetailsLabel">Trip status</p>
              <p className="conciergeBookingDetailsValue">{transportInfo.details.status}</p>
            </div>
            <div className="conciergeBookingDetailsPanelHalfPart">
              <p className="conciergeBookingDetailsLabel">Order value</p>
              <p className="conciergeBookingDetailsValue">
                $
                {transportInfo.fee}
              </p>
            </div>
          </section>
        )
        : <p>Current booking does not contain information about client transport selection.</p>
    }
  </Block>
);

ClientTransportBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transportInfo: object,
};

ClientTransportBlock.defaultProps = {
  transportInfo: null,
};

export default ClientTransportBlock;
