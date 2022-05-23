import React, { useState } from 'react';
import {
  func, bool, string, objectOf,
} from 'prop-types';
import InlineSVG from 'react-inlinesvg';
import cx from 'classnames';

import selectedIcon from 'assets/images/services/service-checked.svg';
import unselectedIcon from 'assets/images/services/service-plus.svg';
import upArrow from 'assets/images/arrow/up.svg';
import downArrow from 'assets/images/arrow/down.svg';

import styles from './styles.module.scss';

const Recall = ({
  service: {
    name,
    description,
    remedy,
    actionType,
  },
  isHighlighted,
  onClick,
}) => {
  const [isShown, setIsShown] = useState(true);

  return (
    <button
      type="button"
      className={cx(styles.recallService, {
        [styles.highlighted]: isHighlighted,
      })}
      onClick={onClick}
    >
      <div className={isHighlighted ? styles.selectedIcon : styles.unselectedIcon}>
        <InlineSVG src={isHighlighted ? selectedIcon : unselectedIcon} />
      </div>
      <div className={styles.smallRecallContent}>
        <button
          type="button"
          className={styles.name}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsShown(!isShown);
          }}
        >
          {(actionType || '').toLowerCase() === 'safety'
            ? '(SAFETY) '
            : ''}
          {name}
          <img
            className={styles.toggle}
            src={isShown ? upArrow : downArrow}
            alt=""
          />
        </button>
        {isShown && <div className={styles.description}>{description}</div>}
        {remedy && (
          <div className={styles.data}>
            <span className={styles.dataKey}>Remedy: </span>
            <span className={styles.dataValue}>{remedy}</span>
          </div>
        )}
        <div className={styles.price}>Free of charge</div>
      </div>
    </button>
  );
};

Recall.propTypes = {
  service: objectOf({
    name: string,
    description: string,
    remedy: string,
    actionType: string,
  }).isRequired,
  onClick: func.isRequired,
  isHighlighted: bool,
};

Recall.defaultProps = { isHighlighted: false };

export default Recall;
