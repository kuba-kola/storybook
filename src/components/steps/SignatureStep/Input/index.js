import React, { Component } from "react";
import {
  func, string, bool, object,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { DELAY_1500 } from "shared/constants/delays";
import { chatSignatureSelector } from "store/selectors/checkin-chat-selectors";
import { confirmSignature, updateSignature } from "store/actions/checkin-chat-actions";

import DrawableCanvas from "components/common/checkin/DrawableCanvas";
import animationWrapper from "components/common/checkin/animationWrapper";
import Button from "components/common/checkin/Button";

import styles from "./styles.module.scss";

const CANVAS_WIDTH = 691;
const CANVAS_HEIGHT = 232;
const CANVAS_LINE_WIDTH = 2;

class SignatureStepInput extends Component {
  state = {
    isCanvasDirty: false,
  };

  handleClearClick = () => {
    this.setState({
      isCanvasDirty: false,
    });
    window.clearSignature();
  };

  render() {
    const { isCanvasDirty } = this.state;
    const {
      signature, onUpdateSignature, onConfirm, isComplete,
    } = this.props;
    return (
      !isComplete && (
        <>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.title}>Signature</div>
              <div className={styles.subtitle}>Please sign your Reservation</div>
            </div>
            <div className={styles.canvasWrapper}>
              {!isCanvasDirty && <div className={styles.placeholder}>Draw your signature here</div>}
              {isCanvasDirty && (
                <div className={styles.clearBtn} onClick={this.handleClearClick}>
                  Clear
                </div>
              )}
              <DrawableCanvas
                signature={signature}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                lineWidth={CANVAS_LINE_WIDTH}
                onUpdateContent={onUpdateSignature}
                disabled={isComplete}
                onDrawStart={() => this.setState({ isCanvasDirty: true })}
              />
            </div>
            <div className={styles.chatInput}>
              <Button
                className={cx(styles.confirm, { [styles.disabled]: !signature })}
                caption="Confirm"
                onClick={onConfirm}
                disabled={!signature}
                isWide
              />
            </div>
          </div>

        </>
      )
    );
  }
}

SignatureStepInput.propTypes = {
  signature: string,
  onConfirm: func.isRequired,
  isComplete: bool,
  classification: object, // eslint-disable-line react/forbid-prop-types
  modelName: string,
  transcription: string,
};

SignatureStepInput.defaultProps = {
  signature: null,
  isComplete: false,
  classification: null,
  transcription: "",
  modelName: "",
};

const mapStateToProps = (state) => ({
  signature: chatSignatureSelector(state),
});

const actions = {
  onUpdateSignature: updateSignature,
  onConfirm: confirmSignature,
};

const SignatureStepInputContainer = connect(mapStateToProps, actions)(SignatureStepInput);

export default animationWrapper(SignatureStepInputContainer, DELAY_1500);
