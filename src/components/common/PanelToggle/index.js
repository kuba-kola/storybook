import React, { useState, useCallback } from "react";
import { node, string } from "prop-types";
import cx from "classnames";
import "./styles.scss";

import AngleDownIcon from "assets/images/bookings/angle-down.svg";
import AngleUpIcon from "assets/images/bookings/angle-up.svg";

const PanelToggle = ({ header, children, className }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(!isPanelOpen);
  }, [isPanelOpen]);

  return (
    <section className={cx("conciergePanel", className, {
      conciergePanelClosed: !isPanelOpen,
    })}
    >

      {header ? (
        <div
          className={cx("conciergePanelHeader", {
            conciergePanelHeaderClosed: !isPanelOpen,
          })}
          onClick={togglePanel}
        >
          {!isPanelOpen
            ? <img alt="angel down" className="angelIcon" src={AngleDownIcon} />
            : <img alt="angel up" className="angelIcon" src={AngleUpIcon} />}

          {header}
        </div>
      ) : null}
      {isPanelOpen && <section className="conciergePanelBody">{children}</section>}
    </section>
  );
};

PanelToggle.propTypes = {
  children: node.isRequired,
  header: node,
  className: string,
};

PanelToggle.defaultProps = {
  header: null,
  className: null,
};

export default PanelToggle;
