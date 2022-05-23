import React from "react";
import { node, string } from "prop-types";
import cx from "classnames";

import "./styles.scss";

const Block = ({ children, title, className }) => (
  <section className={cx("conciergeBlock", className)}>
    {title ? <section className="conciergeBlockTitle">{title}</section> : null}
    <section className="conciergeBlockContent">{children}</section>
  </section>
);

Block.propTypes = {
  children: node.isRequired,
  title: node,
  className: string,
};

Block.defaultProps = {
  title: "",
  className: null,
};

export default Block;
