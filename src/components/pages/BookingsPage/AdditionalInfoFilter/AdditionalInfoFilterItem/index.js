import React from "react";
import {
  bool, func, string,
} from "prop-types";
import cx from "classnames";

import "./styles.scss";

const AdditionalInfoFilterItem = ({
  assets, isActive, handleOnClick,
}) => (
  <div
    className={
      cx("AdditionalInfoFilterItem", {
        AdditionalInfoFilterItemActive: isActive,
      })
    }
    onClick={handleOnClick}
  >
    <img
      src={assets || null}
      alt="img"
    />
  </div>
);

AdditionalInfoFilterItem.propTypes = {
  assets: string.isRequired,
  isActive: bool,
  handleOnClick: func.isRequired,
};

AdditionalInfoFilterItem.defaultProps = {
  isActive: false,
};

export default AdditionalInfoFilterItem;
