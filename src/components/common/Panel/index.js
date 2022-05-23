import React from "react";
import { node, string } from "prop-types";
import cx from "classnames";
import "./styles.scss";

const Panel = ({ header, children, className }) => (
  <section className={cx("conciergePanel", className)}>
    {header ? <div className="conciergePanelHeader">{header}</div> : null}
    <section className="conciergePanelBody">{children}</section>
  </section>
);

Panel.propTypes = {
  children: node.isRequired,
  header: node,
  className: string,
};

Panel.defaultProps = {
  header: null,
  className: null,
};

export default Panel;
