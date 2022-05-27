import React from "react";
import {
  node, string, oneOf, bool,
} from "prop-types";
import cx from "classnames";
import serviceButtonIcons from "shared/serviceButtonIcons";

import "./styles.scss";

const Button = ({
  className,
  children,
  type,
  variant,
  padding,
  fullWidth,
  icon,
  ...props
}) => {
  const buttonClasses = cx(
    "conciergeButton",
    className,
    {
      conciergeButtonBaseGrey: variant === "base-grey",
      conciergeButtonNeutral: variant === "neutral",
      conciergeButtonAqua: variant === "aqua",
      conciergeButtonBrand: variant === "brand",
      conciergeButtonBrandOutline: variant === "brand-outline",
      conciergeButtonDark: variant === "dark",
      conciergeButtonDarkOutline: variant === "dark-outline",
      conciergeButtonSuccess: variant === "success",
      conciergeButtonDestructive: variant === "destructive",
      conciergeButtonDestructiveOutline: variant === "destructive-outline",
    },
    {
      conciergeButtonSmallPadding: padding === "small",
      conciergeButtonMediumPadding: padding === "medium",
      conciergeButtonLargePadding: padding === "large",
    },
    {
      conciergeButtonFullWidth: fullWidth,
    },
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      {...props}
    >
      {icon
        && <img src={serviceButtonIcons[icon]} alt="" />}

      {children}
    </button>
  );
};

Button.propTypes = {
  children: node.isRequired,
  className: string,
  type: string,
  variant: oneOf([
    "base",
    "base-grey",
    "neutral",
    "aqua",
    "brand",
    "brand-outline",
    "dark",
    "dark-outline",
    "success",
    "destructive",
    "destructive-outline",
  ]),
  padding: oneOf(["small", "medium", "large"]),
  fullWidth: bool,
  icon: oneOf([
    "add",
    "addWhite",
    "bin",
    "close",
    "checkmark",
    "edit",
    "editGrey",
    "editWhite",
    "leftArrow",
    "rightArrow",
    null,
  ]),
};

Button.defaultProps = {
  className: null,
  type: "button",
  variant: "base",
  padding: "large",
  fullWidth: false,
  icon: null,
};

export default Button;
