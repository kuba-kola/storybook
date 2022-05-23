import React from "react";
import { func, bool } from "prop-types";
import InlineSVG from "react-inlinesvg";
import cx from "classnames";

import { servicePropType } from "shared/prop-types";
import selectedIcon from "assets/icons/services/service-checked.svg";
import unselectedIcon from "assets/icons/services/service-plus.svg";

import styles from "./styles.module.scss";

const ExtensionService = ({
  service, isHighlighted, isRecall, onClick,
}) => (
  <button className={cx(styles.container, { [styles.highlighted]: isHighlighted })} onClick={onClick}>
    <div className={isHighlighted ? styles.selectedIcon : styles.unselectedIcon}>
      <InlineSVG src={isHighlighted ? selectedIcon : unselectedIcon} />
    </div>
    <div className={styles.content}>
      <div className={styles.name}>{service.name}</div>
      {isRecall && <div className={cx(styles.attr, styles.text)}>Recall - free of charge</div>}
      {/* {isRecall ? (
        <div className={cx(styles.attr, styles.text)}>Recall - free of charge</div>
      ) : (
        <div className={styles.text}>
          <span className={styles.attr}>Time:</span>
          <span>{`+ ${service.allocated_labor_time} hours more`}</span>
        </div>
      )} */}

      <div className={styles.text}>
        <span className={styles.attr}>Price:</span>
        <span>
          $
          {service.fee || 0}
        </span>
      </div>
    </div>
  </button>
);

ExtensionService.propTypes = {
  service: servicePropType.isRequired,
  onClick: func.isRequired,
  isHighlighted: bool,
  isRecall: bool,
};

ExtensionService.defaultProps = {
  isHighlighted: false,
  isRecall: false,
};

export default ExtensionService;
