import React, { Component } from "react";
import {
  func, string, bool, node,
} from "prop-types";
import searchIcon from "assets/images/search.svg";

import "./styles.scss";

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.state = { isTooltipVisible: false, value: this.props.value };
    this.searchInput = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value && this.props.value !== this.state.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleInputChange = (value) => {
    const { onChange } = this.props;

    this.setState({ value });
    if (onChange) onChange(value);
  }

  handleEnterPress = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      this.props.onEnter(this.state.value);
    }
  }

  revealTooltip = () => {
    if (this.props.showTooltip) {
      this.setState({ isTooltipVisible: true });
    }
  }

  hideTooltip = () => {
    if (this.props.showTooltip) {
      this.setState({ isTooltipVisible: false });
    }
  }

  focusOnInputField() {
    this.searchInput.current.focus();
    window.scrollTo(0, this.searchInput.current.offsetTop);
  }

  render() {
    const {
      placeholder,
      showTooltip,
      tooltipContent,
    } = this.props;
    const { isTooltipVisible, value } = this.state;

    return (
      <section className="conciergeSearchField">
        <input
          ref={this.searchInput}
          className="conciergeSearchFieldInput"
          placeholder={placeholder}
          value={value}
          onKeyUp={this.handleEnterPress}
          onChange={(e) => this.handleInputChange(e.target.value)}
        />
        <img
          src={searchIcon}
          alt="concierge search"
          className="conciergeSearchFieldIcon"
          onMouseEnter={this.revealTooltip}
          onMouseLeave={this.hideTooltip}
        />
        {
          showTooltip && isTooltipVisible
            ? <section className="conciergeSearchFieldTooltip">{tooltipContent}</section>
            : null
        }
      </section>
    );
  }
}

SearchField.propTypes = {
  onChange: func,
  onEnter: func,
  placeholder: string,
  showTooltip: bool,
  tooltipContent: node,
  value: string,
};

SearchField.defaultProps = {
  onChange: null,
  onEnter: null,
  placeholder: "",
  showTooltip: true,
  tooltipContent: "",
  value: "",
};

export default SearchField;
