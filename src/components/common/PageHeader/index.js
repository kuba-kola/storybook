import React from "react";
import { node, string } from "prop-types";
import cx from "classnames";

import "./styles.scss";

const PageHeader = ({ title, rightSideContent, className }) => (
  <section className={cx("conciergePageHeader", className)}>
    <section className="conciergePageHeaderCentering">
      <div className="conciergePageHeaderTitle">{title}</div>
      {
        rightSideContent
          ? <div className="conciergePageHeaderRightContent">{rightSideContent}</div>
          : null
      }
    </section>
  </section>
);

PageHeader.propTypes = {
  title: node.isRequired,
  rightSideContent: node,
  className: string,
};

PageHeader.defaultProps = {
  rightSideContent: null,
  className: null,
};

export default PageHeader;
