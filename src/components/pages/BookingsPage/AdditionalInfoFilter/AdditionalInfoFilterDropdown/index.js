import React, {
  useState, useCallback, useEffect, useRef,
} from "react";
import {
  bool,
  func,
  objectOf,
  string,
  element,
  arrayOf,
  shape,
} from "prop-types";
import { isEmpty } from "ramda";
import cx from "classnames";
import { useOutsideClick } from "shared/hooks";

import CheckedIcon from "assets/images/bookings/checked.svg";
import UncheckedIcon from "assets/images/bookings/unchecked.svg";
import CaretMintIcon from "assets/images/bookings/caret-mint.svg";

import AdditionalInfoFilterDropdownItem from "./AdditionalInfoFilterDropdownItem";

import "./styles.scss";

const AdditionalInfoFilterDropdown = ({
  dropdownKey,
  filters,
  dropdownConfig,
  handleOnClick,
  toggleAllItems,
  dropdownIcon,
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpenDropdown(!isOpenDropdown);
  }, [isOpenDropdown]);

  const getActiveItem = useCallback(() => {
    if (isEmpty(filters)) return false;
    const activeKey = Object.keys(filters).find((key) => filters[key]);
    const activeItem = dropdownConfig.find((item) => item.key === activeKey);

    return activeItem;
  }, [filters]);

  const isAllSelected = () => {
    if (isEmpty(filters)) return false;

    const valuesArr = Object.values(filters);
    return valuesArr.length === valuesArr.filter((value) => value).length;
  };

  const isSomeSelected = () => Object.values(filters).some((value) => value);

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setIsOpenDropdown(false));

  const activeItem = getActiveItem();
  const isAllSelectedBool = isAllSelected();
  const isSomeSelectedBool = isSomeSelected();
  return (
    <>
      <div
        className={cx("AdditionalInfoFilterDropdown", {
          AdditionalInfoFilterItemActive: activeItem,
        })}
        onClick={toggleDropdown}
      >
        <img
          className="circle"
          src={dropdownIcon}
          alt="img"
        />
        <img
          className={cx("caret", {
            caretOpen: isOpenDropdown,
          })}
          src={CaretMintIcon}
          alt="caret"
        />
      </div>
      {isOpenDropdown && (
        <div className="AdditionalInfoFilterDropdownContent" ref={wrapperRef}>
          <div className="AdditionalInfoFilterDropdownContentHead">
            <div
              className="AdditionalInfoFilterDropdownSelectAllBtn"
              onClick={() => toggleAllItems({ dropdownKey, itemsValue: true })}
            >
              <img
                src={isAllSelectedBool ? CheckedIcon : UncheckedIcon}
                alt="checkbox"
              />
              <span>Select All</span>
            </div>
            <button
              type="button"
              className={cx("AdditionalInfoFilterDropdownResetBtn", {
                AdditionalInfoFilterDropdownResetBtnDisabled: !isSomeSelectedBool,
              })}
              disabled={!isSomeSelectedBool}
              onClick={() => toggleAllItems({ dropdownKey, itemsValue: false })}
            >
              Reset
            </button>
          </div>
          <hr />
          <ul>
            {dropdownConfig.map(({ key, icon, caption }) => (
              <AdditionalInfoFilterDropdownItem
                key={key}
                assets={icon.type || icon}
                isActive={filters[key]}
                caption={caption}
                handleOnClick={() => handleOnClick({ itemKey: key, dropdownKey })}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

AdditionalInfoFilterDropdown.propTypes = {
  dropdownKey: string.isRequired,
  filters: objectOf(bool).isRequired,
  dropdownConfig: arrayOf(
    shape({
      key: string,
      assets: element,
      caption: string,
    }),
  ).isRequired,
  dropdownIcon: string.isRequired,
  handleOnClick: func.isRequired,
  toggleAllItems: func.isRequired,
};

export default AdditionalInfoFilterDropdown;
