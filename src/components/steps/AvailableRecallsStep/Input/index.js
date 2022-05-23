import React, { Component } from "react";
import {
  func, bool, string, object,
} from "prop-types";
import { connect } from "react-redux";

import { DELAY_2000 } from "shared/constants/delays";
import { servicesPropType } from "shared/prop-types";
import { selectRecalls, toggleRecall } from "store/actions/checkin-chat-actions";
import {
  chatSelectedRecallsSelector,
  chatLoadingSelector,
  chatAvailableRecallsSelector,
} from "store/selectors/checkin-chat-selectors";

import animationWrapper from "components/common/checkin/animationWrapper";
import Button from "components/common/checkin/Button";

import styles from "./styles.module.scss";

class AvailableRecallsStepInput extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.transcription !== prevProps.transcription && !this.props.isComplete) {
      this.props.classifyTranscription({
        modelName: "availableRecalls",
        transcription: this.props.transcription,
      });
    }
    if (
      this.props.classification !== prevProps.classification
      && this.props.modelName === "availableRecalls"
      && !this.props.isComplete
    ) {
      switch (this.props.classification.intent) {
        case "reject":
          this.props.onDecline();
          break;
        case "confirm":
          if (this.props.selectedServices.length) {
            this.props.onAccept(this.props.selectedServices);
          } else {
            this.props.onToggle(this.props.availableRecalls[0]);
            this.props.onAccept(this.props.selectedServices);
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

AvailableRecallsStepInput.propTypes = {
  selectedServices: servicesPropType,
  onAccept: func.isRequired,
  onDecline: func.isRequired,
  isComplete: bool,
  onToggle: func.isRequired,
  availableRecalls: servicesPropType.isRequired,
  classification: object, // eslint-disable-line react/forbid-prop-types
  modelName: string,
  transcription: string,
};

AvailableRecallsStepInput.defaultProps = {
  selectedServices: [],
  isComplete: false,
  classification: null,
  transcription: "",
  modelName: "",
};

const mapStateToProps = (state) => ({
  selectedServices: chatSelectedRecallsSelector(state),
  isComplete: chatLoadingSelector(state),
  availableRecalls: chatAvailableRecallsSelector(state),
});

const actions = {
  onAccept: selectRecalls,
  onDecline: () => selectRecalls(null),
  onToggle: toggleRecall,
};

const AvailableRecallsStepInputContainer = connect(mapStateToProps, actions)(AvailableRecallsStepInput);

export default animationWrapper(AvailableRecallsStepInputContainer, DELAY_2000);
