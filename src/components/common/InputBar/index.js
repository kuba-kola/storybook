import React from "react";
import { shape, func, object } from "prop-types";
import { connect } from "react-redux";

import { chatInputSelector } from "store/selectors/checkin-chat-selectors";

import styles from "./styles.module.scss";

const InputBar = ({ currentInput }) => {
  if (currentInput) {
    const InputComponent = currentInput.component;
    return (
      <div className={styles.container}>
        <InputComponent {...currentInput.props} />
      </div>
    );
  }
  return null;
};

InputBar.propTypes = {
  currentInput: shape({
    component: func.isRequired,
    props: object,
  }),
};

InputBar.defaultProps = {
  currentInput: null,
};

const mapStateToProps = (state) => ({
  currentInput: chatInputSelector(state),
});

const InputBarContainer = connect(mapStateToProps)(InputBar);

export default InputBarContainer;
