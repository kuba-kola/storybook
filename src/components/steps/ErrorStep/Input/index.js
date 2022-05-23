import React from "react";
import { func, bool } from "prop-types";
import { connect } from "react-redux";

import { exit } from "store/actions/checkin-app-actions";
import { replayLastRequest } from "store/actions/checkin-chat-actions";
import animationWrapper from "components/common/checkin/animationWrapper";
import Button from "components/common/checkin/Button";

import styles from "./styles.module.scss";

const ErrorStepInput = ({ canRetry, onRetry, onExit }) => canRetry && (
<div className={styles.chatInput}>
  <Button caption="Exit" isSecondary onClick={onExit} isWide />
  <Button caption="Try Again" onClick={onRetry} isWide />
</div>
);

ErrorStepInput.propTypes = {
  canRetry: bool,
  onExit: func.isRequired,
  onRetry: func.isRequired,
};

ErrorStepInput.defaultProps = {
  canRetry: false,
};

const actions = {
  onExit: exit,
  onRetry: replayLastRequest,
};

const ErrorStepInputContainer = connect(null, actions)(ErrorStepInput);

export default animationWrapper(ErrorStepInputContainer);
