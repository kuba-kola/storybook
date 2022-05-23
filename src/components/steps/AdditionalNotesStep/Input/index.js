import React, { Component } from "react";
import { func } from "prop-types";
import { connect } from "react-redux";

import { DELAY_1000 } from "shared/constants/delays";
import { addNotes } from "store/actions/checkin-chat-actions";
import sendIcon from "assets/icons/send.svg";
import Button from "components/common/checkin/Button";
import animationWrapper from "components/common/checkin/animationWrapper";

import styles from "./styles.module.scss";

class AdditionalNotesStepInput extends Component {
  state = {
    isEditing: false,
    isComplete: false,
    notes: "",
  };

  editNote = () => this.setState({ isEditing: true });

  handleChange = (event) => this.setState({ notes: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isComplete: true });
    if (this.state.notes) {
      this.props.onAddNote(this.state.notes);
    } else {
      this.props.onConfirm();
    }
  };

  submitEmpty = () => {
    this.setState({ isComplete: true });
    this.props.onConfirm();
  };

  renderForm = () => (
    <div className={styles.chatInput}>
      <form className={styles.form} onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Please describe what needs to be done"
          className={styles.input}
          value={this.state.description}
          onChange={this.handleChange}
        />
        <button className={styles.submit} onClick={this.handleSubmit}>
          <img alt="send" className={styles.icon} src={sendIcon} />
        </button>
      </form>
    </div>
  );

  renderButtons = () => (
    <div className={styles.chatInput}>
      <Button isSecondary className={styles.firstButton} caption="Add a note" onClick={this.editNote} isWide />
      <Button caption="That's all" onClick={this.submitEmpty} isWide />
    </div>
  );

  render() {
    if (this.state.isComplete) {
      return null;
    }
    return this.state.isEditing ? this.renderForm() : this.renderButtons();
  }
}

AdditionalNotesStepInput.propTypes = {
  onAddNote: func.isRequired,
  onConfirm: func.isRequired,
};

const actions = {
  onAddNote: addNotes,
  onConfirm: () => addNotes(null),
};

const AdditionalNotesStepInputContainer = connect(null, actions)(AdditionalNotesStepInput);

export default animationWrapper(AdditionalNotesStepInputContainer, DELAY_1000);
