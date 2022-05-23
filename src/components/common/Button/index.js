import React from "react";
import { node, string } from "prop-types";
import cx from "classnames";

import "./styles.scss";

const Button = ({
  className, children, type, ...props
}) => {
  const buttonClasses = cx("conciergeButton", className);
  return (
    <button
      type={type}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: node.isRequired,
  className: string,
  type: string,
};

Button.defaultProps = {
  className: null,
  type: "button",
};

export default Button;
