import React from "react";
import { boolean, func } from "prop-types";
import cx from "classnames";

import leftArrowIcon from "assets/images/leftArrowIcon.svg";
import rightArrowIcon from "assets/images/rightArrowIcon.svg";

import "../styles.scss";

const ArrowButton = ({
  isLeft,
  isRight,
  disabled,
  onClick,
}) => (
  <button
    type="button"
    className="carouselArrowButton"
    disabled={disabled}
    onClick={onClick}
  >
    <img
      className={cx("carouselArrowIcon", { carouselArrowIconDisabled: disabled })}
      src={isLeft ? leftArrowIcon : isRight ? rightArrowIcon : null}
      alt={isLeft ? "leftArrowIcon" : isRight ? "rightArrowIcon" : "arrowIcon"}
    />
  </button>
);

ArrowButton.defaultProps = {
  isLeft: false,
  isRight: false,
};

ArrowButton.propTypes = {
  isLeft: boolean,
  isRight: boolean,
  onClick: func.isRequired,
};

export default ArrowButton;
