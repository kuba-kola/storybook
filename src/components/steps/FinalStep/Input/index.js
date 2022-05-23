import React, { Component } from "react";
import { connect } from "react-redux";
import {
  object, func, bool, string,
} from "prop-types";

import { DELAY_1500 } from "shared/constants/delays";
import { exit } from "store/actions/checkin-app-actions";
import { appDealershipSlugSelector } from "store/selectors/checkin-app-selectors";

import animationWrapper from "components/common/checkin/animationWrapper";
import Button from "components/common/checkin/Button";

import styles from "./styles.module.scss";

class FinalStepInput extends Component {
  exit = () => {
    this.props.onExit();
  };

  render() {
    return (
      this.props.isComplete && (
        <div className={styles.chatInput}>
          <Button delay={DELAY_1500} caption="Thanks" onClick={this.exit} />
        </div>
      )
    );
  }
}

FinalStepInput.propTypes = {
  classification: object,
  /* eslint-enable react/forbid-prop-types */
  onExit: func.isRequired,
  isComplete: bool,
  modelName: string,
  transcription: string,
};

FinalStepInput.defaultProps = {
  isComplete: false,
  classification: null,
  transcription: "",
  modelName: "",
};

const mapStateToProps = (state) => ({ dealershipSlug: appDealershipSlugSelector(state) });

const actions = {
  onExit: exit,
};

const FinalStepInputContainer = connect(mapStateToProps, actions)(FinalStepInput);

export default animationWrapper(FinalStepInputContainer, DELAY_1500);
