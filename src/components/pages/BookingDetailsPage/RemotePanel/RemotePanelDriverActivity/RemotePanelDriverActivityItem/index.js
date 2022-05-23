import React from "react";
import { shape, bool, string } from "prop-types";
import cx from "classnames";

import {
  driverActivityIcon,
  driverActivityLabel,
} from "./utils";

const RemotePanelDriverActivityItem = ({ item }) => (
  <div
    className={cx("RemotePanelDriverActivityItem", {
      RemotePanelDriverActivityItemActive: item.isActive,
      RemotePanelDriverActivityItemDone: item.isDone,
    })}
  >
    <div className="iconRow">
      <div className="circle">
        <img
          src={driverActivityIcon(item.key).type}
          alt={item.key}
          className="activityIcon"
        />
      </div>
      <p className="activityLabel">{driverActivityLabel(item.key)}</p>
    </div>
    <p className="activityDate">{item.date}</p>

  </div>
);

RemotePanelDriverActivityItem.propTypes = {
  item: shape({
    date: string,
    isActive: bool,
    isDone: bool,
    key: string,
  }).isRequired,
};

export default RemotePanelDriverActivityItem;
