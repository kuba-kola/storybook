import React from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { ReactComponent as IconArrowLeft } from "assets/icons/arrow/left.svg";
import {
  appDealershipLogoSelector,
  appDealershipNameSelector,
} from "store/selectors/checkin-app-selectors";
import closeIcon from "assets/images/cross.svg";
import styles from "./styles.module.sass";

const Header = (props) => {
  const {
    arrowBack,
    title,
    dealershipLogo,
    dealershipName,
    isFixed,
    onClose,
  } = props;

  return (
    <div className={cx(styles.header, { [styles.fixed]: isFixed })}>
      <div className={styles.headerWrap}>
        {arrowBack ? (
          <div className={styles.goBack} onClick={onClose}>
            <IconArrowLeft />
            <span>Back</span>
          </div>
        ) : dealershipLogo ? (
          <img
            src={dealershipLogo}
            alt="dealer logo"
            className={styles.dealerLogo}
          />
        ) : (
          <span className={styles.dealerName}>{dealershipName}</span>
        )}

        {title ? (
          <>
            <p className={styles.title}>{title}</p>
            <span className={styles.hidden} />
          </>
        ) : null}

        <button
          className={styles.button}
          onClick={onClose}
        >
          <img src={closeIcon} alt="close" className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dealershipName: appDealershipNameSelector(state),
  dealershipLogo: appDealershipLogoSelector(state),
});
export default connect(mapStateToProps)(Header);
