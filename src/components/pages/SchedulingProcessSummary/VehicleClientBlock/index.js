import React from "react";
import { object, string } from "prop-types";
import { format } from "date-fns";

import { AMERICAN_DATE_FORMAT } from "shared/utils/datetime";

import Panel from "components/common/Panel";
import VehicleDetailsBlock from "./VehicleDetailsBlock";
import ClientDetailsBlock from "./ClientDetailsBlock";

import "./styles.scss";

const VehicleClientBlock = ({ customer, vehicle, time }) => (
  (
    <>
      <Panel className="schedulingProcessSummaryPanelCard">
        <section className="schedulingProcessSummaryPanelRow">
          <VehicleDetailsBlock
            vehicle={vehicle}
            time={time}
          />
        </section>
        {/* <section className="schedulingProcessSummaryPanelRow">
          <div className="schedulingProcessSummaryPanelCreatedAt">
            <BookingCreatedAt time={time} />
          </div>
        </section> */}
        <section className="schedulingProcessSummaryPanelRow">
          <ClientDetailsBlock
            customer={customer}
          />
        </section>
      </Panel>
    </>
  )
);

VehicleClientBlock.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  customer: object,
  // eslint-disable-next-line react/forbid-prop-types
  vehicle: object,
  // eslint-disable-next-line react/forbid-prop-types
  time: object,
};

VehicleClientBlock.defaultProps = {
  customer: null,
  vehicle: null,
  time: null,
};

const BookingCreatedAt = ({ time: { day: { full_date } } }) => (
  <section className="schedulingProcessSummaryPanelCreated">
    <span className="schedulingProcessSummaryPanelCreatedLabel">Booking created: </span>
    <span className="schedulingProcessSummaryPanelCreatedTime">
      {format(full_date, AMERICAN_DATE_FORMAT)}
    </span>
  </section>
);

BookingCreatedAt.prototype = {
  full_date: string,
};

BookingCreatedAt.defaultProps = {
  full_date: null,
};

export default VehicleClientBlock;
