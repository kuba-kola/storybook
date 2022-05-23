import React, { Component } from "react";
import {
  arrayOf, oneOfType, string, number, bool, func, shape,
} from "prop-types";
import cx from "classnames";
import enhanceWithClickOutside from "react-click-outside";

class DriversDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {
        id: (this.props.defaultSelected && this.props.defaultSelected.id) || "",
        name: (this.props.defaultSelected && this.props.defaultSelected.name) || this.props.placeholder || "",
      },
      isMenuOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultSelected === "" && prevProps.defaultSelected !== this.props.defaultSelected) {
      this.setState({
        selectedOption: {
          id: "",
          name: this.props.placeholder || "",
        },
      });
    }
  }

  handleSelect = (option) => {
    const { onSelect, readOnly } = this.props;
    if (readOnly) return;
    this.setState({ selectedOption: option });
    onSelect(option);
    this.setState({ isMenuOpen: false });
  }

  toggleMenu = () => {
    if (this.props.readOnly) return;

    const { handleOpen } = this.props;

    if (!this.state.isMenuOpen && handleOpen) handleOpen();

    this.setState(({ isMenuOpen }) => ({ isMenuOpen: !isMenuOpen }));
  }

  handleClickOutside = () => {
    if (this.props.readOnly) return;
    this.setState({ isMenuOpen: false });
  }

  render() {
    const { options, readOnly, isLoading } = this.props;
    const { selectedOption, isMenuOpen } = this.state;
    const listClasses = cx("conciergeDropdownMenu", { "conciergeDropdownMenu-open": isMenuOpen && !readOnly });

    return (
      <section className="conciergeDropdownWrapper">
        <div
          className={cx("conciergeDropdownSelectedField", {
            "conciergeDropdownSelectedField-disabled": readOnly,
          })}
          onClick={this.toggleMenu}
        >
          <span className="conciergeDropdownLabel">
            {isLoading ? "Loading..." : selectedOption.name}
          </span>
          <span className="conciergeDropdownArrow" />
        </div>
        {!isLoading && (
          <ul className={listClasses}>
            {options.length > 0
              ? (
                <>
                  <li
                    key="none"
                    className="conciergeDropdownMenuItem"
                    onClick={() => this.handleSelect("")}
                  >
                    None
                  </li>
                  {options.map((option) => (
                    <li
                      key={option.id}
                      className="conciergeDropdownMenuItem"
                      onClick={() => this.handleSelect(option)}
                    >
                      {option.name}
                    </li>
                  ))}
                </>
              )
              : (
                <li className="conciergeDropdownMenuItem">No drivers found</li>
              )}
          </ul>
        )}
      </section>
    );
  }
}

DriversDropdown.propTypes = {
  options: arrayOf(shape({
    value: oneOfType([string, number]).isRequired,
    label: string.isRequired,
  })),
  defaultSelected: oneOfType([string, shape({
    value: oneOfType([string, number]),
    label: string,
  })]),
  readOnly: bool,
  isLoading: bool,
  onSelect: func,
  placeholder: string,
  handleOpen: func,
};

DriversDropdown.defaultProps = {
  options: [],
  defaultSelected: {
    value: "",
    label: "",
  },
  readOnly: false,
  isLoading: false,
  onSelect: null,
  placeholder: null,
  handleOpen: null,
};

export default (enhanceWithClickOutside(DriversDropdown));
