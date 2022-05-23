import React, { Component } from "react";
import { bool, func, string } from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { describeDecisionTree } from "store/actions/checkin-decision-trees-actions";
import sendIcon from "assets/icons/send.svg";
import { DELAY_1000 } from "shared/constants/delays";
import animationWrapper from "components/common/checkin/animationWrapper";

import styles from "./styles.module.scss";

class DecisionTreeDescriptionStepInput extends Component {
  state = {
    description: this.props.description || "",
  };

  componentDidUpdate(prevProps) {
    if (prevProps.description !== this.props.description) {
      this.setState({ description: this.props.description });
    }
  }

  handleChange = (event) => this.setState({ description: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.description);
    this.setState({ description: "" });
  };

  render() {
    if (this.props.isComplete) {
      return null;
    }
    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <input
            type="text"
            className={styles.input}
            value={this.state.description}
            onChange={this.handleChange}
            maxLength={50}
          />
          <button className={styles.submit} onClick={this.handleSubmit}>
            <img alt="send" className={styles.icon} src={sendIcon} />
          </button>
        </form>
      </div>
    );
  }
}

DecisionTreeDescriptionStepInput.propTypes = {
  onSubmit: func.isRequired,
  description: string,
  isComplete: bool,
};

DecisionTreeDescriptionStepInput.defaultProps = {
  description: null,
  isComplete: false,
};

const actions = {
  onSubmit: describeDecisionTree,
};

const DecisionTreeDescriptionStepInputContainer = connect(null, actions)(DecisionTreeDescriptionStepInput);

export default animationWrapper(DecisionTreeDescriptionStepInputContainer, DELAY_1000);
