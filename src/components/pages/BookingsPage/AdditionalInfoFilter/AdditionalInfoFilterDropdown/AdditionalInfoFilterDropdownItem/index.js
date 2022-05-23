import React from "react";
import {
  bool, func, string,
} from "prop-types";
import cx from "classnames";

import "./styles.scss";

import CheckedIcon from "assets/images/bookings/checked.svg";
import UncheckedIcon from "assets/images/bookings/unchecked.svg";

const AdditionalInfoFilterDropdownItem = ({
  assets, caption, isActive, handleOnClick,
}) => (
  <div
    className={
      cx("AdditionalInfoFilterDropdownItem", {
        AdditionalInfoFilterDropdownItemActive: isActive,
      })
    }
    onClick={handleOnClick}
  >
    <img
      src={isActive ? CheckedIcon : UncheckedIcon}
      alt={isActive ? "checked" : "unchecked"}
    />
    <img
      src={assets || null}
      alt="img"
    />
    <span>{caption}</span>
  </div>
);

AdditionalInfoFilterDropdownItem.propTypes = {
  caption: string.isRequired,
  assets: string.isRequired,
  isActive: bool.isRequired,
  handleOnClick: func.isRequired,
};

export default AdditionalInfoFilterDropdownItem;
