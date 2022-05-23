import React, { useState, useEffect } from "react";
import {
  arrayOf, oneOfType, string, number, bool, func, shape,
} from "prop-types";
import cx from "classnames";
import enhanceWithClickOutside from "react-click-outside";

import "./styles.scss";

const Dropdown = ({
  defaultSelected,
  placeholder,
  onSelect,
  readOnly,
  options,
}) => {
  const { label, value } = defaultSelected;
  const [selectedOption, setSelectedOption] = useState({
    label: label || placeholder || "",
    value: value || "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedOption(defaultSelected);
  }, [defaultSelected]);

  const handleSelect = (option) => {
    if (readOnly) return;
    setSelectedOption(option);
    onSelect(option);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (readOnly) return;
    setIsMenuOpen(!isMenuOpen);
  };

  const listClasses = cx("conciergeDropdownMenu", { "conciergeDropdownMenu-open": isMenuOpen && !readOnly });

  return (
    <section className="conciergeDropdownWrapper">
      <div
        className={cx("conciergeDropdownSelectedField", {
          "conciergeDropdownSelectedField-disabled": readOnly,
        })}
        onClick={toggleMenu}
      >
        <span className="conciergeDropdownLabel">{selectedOption.label}</span>
        <span className="conciergeDropdownArrow" />
      </div>
      <ul className={listClasses}>
        {options.map((option) => (
          <li
            key={option.value}
            className="conciergeDropdownMenuItem"
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </section>
  );
};

Dropdown.propTypes = {
  options: arrayOf(shape({
    value: oneOfType([string, number]).isRequired,
    label: string.isRequired,
  })).isRequired,
  defaultSelected: shape({
    value: oneOfType([string, number]).isRequired,
    label: string.isRequired,
  }),
  readOnly: bool,
  onSelect: func,
  placeholder: string,
};

Dropdown.defaultProps = {
  defaultSelected: { value: "" },
  readOnly: false,
  onSelect: null,
  placeholder: null,
};

export default (enhanceWithClickOutside(Dropdown));
