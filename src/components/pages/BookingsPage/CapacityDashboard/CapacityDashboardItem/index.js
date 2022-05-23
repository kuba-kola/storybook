import React from "react";
import cx from "classnames";
import { isNil } from "ramda";

import arrowDownIcon from "assets/images/down.svg";
import arrowUpIcon from "assets/images/up.svg";

import "../styles.scss";

const CapacityDashboardItem = ({
  isDropdown,
  isSelected,
  name,
  avatarSrc,
  capacityLabel,
  capacityProgress,
  onToggleClick,
}) => (
  <button
    type="button"
    className={cx("capacityDashboardRowItem", {
      capacityDashboardRowItemPale: isDropdown && isSelected,
      capacityDashboardRowItemSelected: !isDropdown && isSelected,
    })}
    onClick={onToggleClick}
  >
    <div className="capacityDashboardRowItemTop">
      {avatarSrc && (
        <img className="capacityDashboardRowItemAvatar" src={avatarSrc} alt="" />
      )}
      <div className={cx({
        capacityDashboardRowItemTitle: !avatarSrc,
        "capacityDashboardRowItemTitle--padding-left": avatarSrc,
      })}
      >
        {name}
      </div>
      {isDropdown && (
        <div
          className="capacityDashboardRowItemToggle"
        >
          <img src={isSelected ? arrowUpIcon : arrowDownIcon} alt="toggle" />
        </div>
      )}
      {capacityLabel && (
        <div className="capacityDashboardRowItemCounter">{capacityLabel}</div>
      )}
    </div>
    {!isNil(capacityProgress) && (
      <div className="capacityDashboardProgressBar">
        <div
          className="capacityDashboardProgressBarValue"
          style={{ width: `${capacityProgress}%` }}
        />
      </div>
    )}
  </button>
);

export default CapacityDashboardItem;
