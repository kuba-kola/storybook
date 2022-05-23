import React from "react";
import { string, func, bool } from "prop-types";
import cx from "classnames";

import styles from "./styles.module.scss";

const Button = ({
  className,
  caption,
  onClick,
  isSecondary,
  disabled,
  isBig,
  isWide,
}) => (
  <button
    onClick={onClick}
    className={cx(
      className,
      {
        [styles.bigButton]: isBig,
      },
      {
        [styles.secondaryButton]: isSecondary,
        [styles.primaryButton]: !isSecondary,
        [styles.wide]: isWide,
        [styles.disabled]: disabled,
      },
    )}
    disabled={disabled}
  >
    {caption}
  </button>
);

Button.propTypes = {
  className: string,
  caption: string.isRequired,
  disabled: bool,
  onClick: func.isRequired,
  isWide: bool,
  isSecondary: bool,
  isBig: bool,
};

Button.defaultProps = {
  className: "",
  isWide: false,
  isSecondary: false,
  disabled: false,
  isBig: false,
};

export default Button;
