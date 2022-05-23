import React, { Component } from "react";
import { oneOf, bool, string } from "prop-types";
import cx from "classnames";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";

import styles from "./styles.module.scss";

const renderMessage = (message, { isOpening, isClosing, isBig } = {}) => (
  <div
    className={cx(isBig ? styles.bigMessage : styles.message, {
      [styles.opening]: isOpening,
      [styles.closing]: isClosing,
    })}
  >
    {message}
  </div>
);

class TextMessage extends Component {
  render() {
    const {
      source, message, isOpening, isClosing, isBig,
    } = this.props;

    return (
      <div
        className={cx(styles.container, {
          [styles.user]: source === SOURCE_CONCIERGE,
        })}
      >
        {source === SOURCE_CONCIERGE
          ? renderMessage(message, { isOpening, isClosing, isBig })
          : renderMessage(message, { isBig })}
      </div>
    );
  }
}

TextMessage.propTypes = {
  source: oneOf([SOURCE_CONCIERGE, SOURCE_USER]).isRequired,
  message: string.isRequired,
  isOpening: bool,
  isClosing: bool,
  isBig: bool,
};

TextMessage.defaultProps = {
  isOpening: false,
  isClosing: false,
  isBig: false,
};

export default TextMessage;
