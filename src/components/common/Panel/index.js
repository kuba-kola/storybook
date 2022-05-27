import React, { useState, useCallback } from "react";
import { bool, node, string } from "prop-types";
import cx from "classnames";
import "./styles.scss";

import AngleDownIcon from "assets/images/bookings/angle-down.svg";
import AngleUpIcon from "assets/images/bookings/angle-up.svg";

const Panel = ({
  header, children, className, isToggle,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(!isToggle);

  const togglePanel = useCallback(() => {
    if (isToggle) {
      setIsPanelOpen(!isPanelOpen);
    }
  }, [isPanelOpen, isToggle]);

  const angleIcon = () => {
    if (isPanelOpen) {
      return (
        <img
          alt="angel up"
          className="angelIcon"
          src={AngleUpIcon}
        />
      );
    }

    return (
      <img
        alt="angel down"
        className="angelIcon"
        src={AngleDownIcon}
      />
    );
  };

  const headerNode = () => (
    <div
      className={cx("conciergePanelHeader", {
        conciergePanelHeaderClosed: !isPanelOpen,
        cursorPointer: isToggle,
      })}
      onClick={togglePanel}
    >
      {isToggle && angleIcon()}
      {header}
    </div>
  );

  const bodyNode = () => {
    if (!isToggle || isPanelOpen) {
      return (
        <section
          className="conciergePanelBody"
        >
          {children}
        </section>
      );
    }

    return null;
  };

  return (
    <section className={cx("conciergePanel", className, {
      conciergePanelClosed: !isPanelOpen,
    })}
    >
      {header ? headerNode() : null}
      {bodyNode()}
    </section>
  );
};

Panel.propTypes = {
  children: node.isRequired,
  header: node,
  className: string,
  isToggle: bool,
};

Panel.defaultProps = {
  header: null,
  className: null,
  isToggle: false,
};

export default Panel;
