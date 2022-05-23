import React, { Component } from "react";
import {
  arrayOf, shape, number, string, bool,
} from "prop-types";
import cx from "classnames";
import upArrow from "assets/icons/arrow/up.svg";
import downArrow from "assets/icons/arrow/down.svg";
import styles from "./styles.module.scss";

class PackageItem extends Component {
  state = {
    isShown: false,
  };

  showPackages = () => this.setState((prevState) => ({ isShown: !prevState.isShown }));

  render() {
    const { isShown } = this.state;
    const { items, extras, isSelected } = this.props;

    return (
      <div
        className={cx(styles.packageItemsContainer, {
          [styles.isSelected]: isSelected,
        })}
      >
        <div className={styles.packageItemsHeader} onClick={this.showPackages}>
          <span> See operations included</span>
          <img src={isShown ? upArrow : downArrow} alt="" />
        </div>
        <div
          className={cx(styles.packageItems, {
            [styles.packageItemsAreShown]: isShown,
          })}
        >
          <div className={styles.packageItemsBody}>
            <div className={styles.packageItemsList}>
              <div className={styles.packageItemsListTitle}>
                Package contains:
              </div>
              {items.map((item) => (
                <div className={styles.packageItemsListItem} key={item.id}>
                  {item.name}
                </div>
              ))}
            </div>
            {extras.length > 0 && (
              <div className={styles.packageItemsList}>
                <div className={styles.packageItemsListTitle}>
                  {" "}
                  Additionally:
                </div>
                {extras.map((item) => (
                  <div className={styles.packageItemsListItem} key={item}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

PackageItem.propTypes = {
  items: arrayOf(shape({ id: number, name: string, fee: number })).isRequired,
  extras: arrayOf(string),
  isSelected: bool,
};

PackageItem.defaultProps = {
  extras: [],
};

export default PackageItem;
