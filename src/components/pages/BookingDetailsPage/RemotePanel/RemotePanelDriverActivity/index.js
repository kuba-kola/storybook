import React from "react";
import {
  shape, string,
} from "prop-types";

import Block from "components/common/Block";
import RemotePanelDriverActivityItem from "./RemotePanelDriverActivityItem";

import "./styles.scss";
import { concatArrays } from "./utils";

const RemotePanelDriverActivity = ({ jobs }) => {
  const list = concatArrays(jobs.activity, jobs.aasm_state);
  return (
    <Block title="Driver activity" className="conciergeBookingDetailsPanel conciergeBookingDetailsPanelDriverActivity">
      {list.map((item) => <RemotePanelDriverActivityItem key={item.key} item={item} />)}
    </Block>
  );
};

RemotePanelDriverActivity.propTypes = {
  jobs: shape({
    aasm_state: string,
    activity: shape({
      driver_assigned_at: string,
      en_route_to_customer_at: string,
      arrived_to_customer_at: string,
      en_route_to_dealership_at: string,
      arrived_to_dealership_at: string,
    }),
  }),
};

RemotePanelDriverActivity.defaultProps = {
  jobs: {
    activity: {},
    aasm_state: "",
  },
};

export default RemotePanelDriverActivity;
