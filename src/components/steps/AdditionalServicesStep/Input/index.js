import React, { Component } from "react";
import {
  func, bool, string, object,
} from "prop-types";
import { connect } from "react-redux";

import { DELAY_2500 } from "shared/constants/delays";
import { servicesPropType } from "shared/prop-types";
import { selectAdditionalServices } from "store/actions/checkin-chat-actions";
import { chatSelectedExtensionsSelector, chatLoadingSelector } from "store/selectors/checkin-chat-selectors";

import animationWrapper from "components/common/checkin/animationWrapper";
import Button from "components/common/checkin/Button";

import styles from "./styles.module.scss";

class AdditionalServicesStepInput extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.transcription !== prevProps.transcription && !this.props.isComplete) {
      this.props.classifyTranscription({
        modelName: "additionalServices",
        transcription: this.props.transcription,
      });
    }
    if (
      this.props.classification !== prevProps.classification
      && this.props.modelName === "additionalServices"
      && !this.props.isComplete
    ) {
      switch (this.props.classification.intent) {
        case "reject":
          this.props.onDecline();
          break;
        case "confirm":
          if (this.selectedServices.length) {
            this.props.onAccept(this.props.selectedServices);
          } else {
            this.props.utteranceNotMatched();
          }
          break;
        default:
          this.props.utteranceNotMatched();
      }
    }
  }

  render() {
    const {
      selectedServices, onAccept, onDecline, isComplete,
    } = this.props;
    return (
      !isComplete && (
        <div className={styles.chatInput}>
          <Button isSecondary className={styles.firstButton} caption="No, thanks" onClick={onDecline} isWide />
          <Button
            className={selectedServices.length ? "" : styles.disabled}
            disabled={!selectedServices.length}
            caption="Confirm"
            onClick={() => onAccept(selectedServices)}
            isWide
          />
        </div>
      )
    );
  }
}

AdditionalServicesStepInput.propTypes = {
  selectedServices: servicesPropType,
  onAccept: func.isRequired,
  onDecline: func.isRequired,
  isComplete: bool,
  classification: object, // eslint-disable-line react/forbid-prop-types
  modelName: string,
  transcription: string,
};

AdditionalServicesStepInput.defaultProps = {
  selectedServices: [],
  isComplete: false,
  classification: null,
  transcription: "",
  modelName: "",
};

const mapStateToProps = (state) => ({
  selectedServices: chatSelectedExtensionsSelector(state),
  isComplete: chatLoadingSelector(state),
});

const actions = {
  onAccept: selectAdditionalServices,
  onDecline: () => selectAdditionalServices(null),
};

const AdditionalServicesStepInputContainer = connect(mapStateToProps, actions)(AdditionalServicesStepInput);

export default animationWrapper(AdditionalServicesStepInputContainer, DELAY_2500);
