import React, {
  useEffect, useState, useRef, useMemo,
} from "react";
import {
  arrayOf, func, number, shape, string,
} from "prop-types";
import { useOutsideClick, usePrevious } from "shared/hooks";
import cx from "classnames";
import upIcon from "assets/images/up.svg";
import downIcon from "assets/images/down.svg";
import checkedIcon from "assets/images/checked.svg";
import uncheckedIcon from "assets/images/unchecked.svg";
import addIcon from "assets/images/addWhite.svg";
import "./styles.scss";

const MultiTagSelect = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [optionsByHash, setOptionsByHash] = useState(options.reduce((obj, option) => ({ ...obj, [option.id]: { ...option, selected: false } }), {}));
  const [isAddSelectActive, setIsAddSelectActive] = useState(false);
  const [selectInput, setSelectInput] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setIsSelectOpen(false));

  useEffect(() => {
    value.map((option) => {
      setOptionsByHash((prevOptionsByHash) => ({
        ...prevOptionsByHash,
        [option.id]: {
          ...option,
          selected: true,
        },
      }));
    });
  }, [value]);

  const searchedOptions = useMemo(() => Object
    .values(optionsByHash)
    .filter(({ name }) => name.toLowerCase().includes(selectInput.toLowerCase())),
  [optionsByHash, selectInput]);

  const isAllSelected = useMemo(() => searchedOptions.every(({ selected }) => selected),
    [optionsByHash, selectInput]);

  const toggleOption = (optionId) => {
    const newOptionsByHash = {
      ...optionsByHash,
      [optionId]: {
        ...optionsByHash[optionId],
        selected: !optionsByHash[optionId].selected,
      },
    };
    setOptionsByHash(newOptionsByHash);
    const selectedOptions = Object.values(newOptionsByHash).filter(({ selected }) => selected);
    onChange(selectedOptions);
  };

  const toggleSelectAllOptions = () => {
    let newOptionsByHash = { ...optionsByHash };
    searchedOptions.map((option) => {
      newOptionsByHash = {
        ...newOptionsByHash,
        [option.id]: {
          ...option,
          selected: !isAllSelected,
        },
      };
    });
    setOptionsByHash(newOptionsByHash);
    const selectedOptions = Object.values(newOptionsByHash).filter(({ selected }) => selected);
    onChange(selectedOptions);
  };

  const renderSelect = () => (
    <div className={cx("multiTagList", {
      multiTagListOutlined: label !== undefined,
    })}
    >
      <div className="multiTagListInner">
        {Object.values(optionsByHash)
          .map((option) => (option.selected ? (
            <div
              key={option.id}
              className="multiTagListItem multiTagListItemGap"
            >
              <div className="multiTagListItemName">{option.name}</div>
              <button
                type="button"
                className="multiTagListItemRemove"
                onClick={() => toggleOption(option.id)}
              >
                <span>+</span>
              </button>
            </div>
          ) : null))}
        {isAddSelectActive ? (
          <div className="multiTagSelect multiTagListItemGap" ref={wrapperRef}>
            <div className="multiTagSelectControl">
              <input
                type="text"
                className="multiTagSelectInput"
                value={selectInput}
                onFocus={() => setIsSelectOpen(true)}
                onChange={(e) => setSelectInput(e.target.value)}
              />
              <button
                type="button"
                className="multiTagSelectIndicator"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <img src={isSelectOpen ? upIcon : downIcon} alt="toggle menu" />
              </button>
            </div>
            {isSelectOpen && (
            <div className="multiTagSelectMenu">
              <button
                className={cx("multiTagSelectMenuItem multiTagSelectMenuSelectAll", {
                  multiTagSelectMenuItemSelected: isAllSelected,
                })}
                onClick={toggleSelectAllOptions}
              >
                <img
                  className="multiTagSelectMenuItemCheckbox"
                  src={isAllSelected ? checkedIcon : uncheckedIcon}
                />
                <div className="multiTagSelectMenuItemLabel">SELECT ALL</div>
              </button>
              <div className="multiTagSelectMenuItemSeparator">&nbsp;</div>
              <div className="multiTagSelectMenuList">
                {searchedOptions.map(({ id, name, selected }) => (
                  <button
                    key={id}
                    className={cx("multiTagSelectMenuItem", {
                      multiTagSelectMenuItemSelected: selected,
                    })}
                    onClick={() => toggleOption(id)}
                  >
                    <img
                      className="multiTagSelectMenuItemCheckbox"
                      src={selected ? checkedIcon : uncheckedIcon}
                    />
                    <div className="multiTagSelectMenuItemLabel">{name}</div>
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="multiTagSelectActionButton multiTagListItemGap"
            onClick={() => setIsAddSelectActive(true)}
          >
            <img alt="add" src={addIcon} />
          </button>
        )}
      </div>
    </div>
  );

  if (!label) renderSelect();

  return (
    <div className="multiTagListOuter">
      <div className="multiTagListLabel">{label}</div>
      {renderSelect()}
    </div>
  );
};

MultiTagSelect.propTypes = {
  label: string,
  onChange: func.isRequired,
  value: arrayOf(shape({
    name: string,
    id: number,
  })),
  options: arrayOf(shape({
    name: string,
    id: number,
  })),
};

MultiTagSelect.defaultProps = {
  label: null,
  options: [],
  value: [],
};

export default MultiTagSelect;
