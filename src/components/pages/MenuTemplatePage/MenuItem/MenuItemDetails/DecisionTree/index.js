import React, { Component } from "react";
import { func, number } from "prop-types";
import { connect } from "react-redux";
import { NotificationContainer, NotificationManager } from "react-notifications";
import cx from "classnames";
import "react-notifications/lib/notifications.css";

import { saveDecisionTree } from "store/actions/menu-template-actions";
import { decisionTreePropType } from "shared/prop-types";
import Button from "components/common/Button";

import TextStep from "./TextStep";
import QuestionStep from "./QuestionStep";
import "./styles.scss";

class DecisionTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      decisionTree: this.props.decisionTree || {
        id: null,
        intro: { text: "", goto: null, abbreviation: "" },
        steps: [],
      },
    };
  }

  getStepsForSelect = (currentIndex) => this.state.decisionTree.steps
    .map((step, index) => ({ value: index.toString(), label: `Step ${index + 1}` }))
    .filter((_step, index) => index !== currentIndex)
    .concat({ value: "END", label: "End" })

  getAllAbreviationsLength = () => {
    const {
      decisionTree: { intro, steps },
    } = this.state;
    return steps
      .map((step) => step.abbreviation.concat(
        (step.answers || []).map((answer) => answer.abbreviation),
      ))
      .join("")
      .concat(intro.abbreviation).length;
  };

  handleIntroChange = (text, goto, abbreviation) => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      intro: { text, goto, abbreviation },
    },
  }))

  /* eslint-disable-next-line max-len */
  handleTextStepChange = (currentIndex) => (text, goto, abbreviation) => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      steps: decisionTree.steps.map((step, index) => (index !== currentIndex
        ? step
        : {
          ...step,
          text,
          goto,
          abbreviation,
        })),
    },
  }));

  /* eslint-disable-next-line max-len */
  handleQuestionStepChange = (currentIndex) => (text, answers, abbreviation) => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      steps: decisionTree.steps.map((step, index) => (index !== currentIndex
        ? step
        : {
          ...step,
          text,
          answers,
          abbreviation,
        })),
    },
  }));

  newTextStep = () => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      steps: [
        ...decisionTree.steps,
        {
          type: "text",
          text: "",
          abbreviation: "",
        },
      ],
    },
  }))

  newQuestionStep = () => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      steps: [
        ...decisionTree.steps,
        {
          type: "question",
          text: "",
          answers: [],
          abbreviation: "",
        },
      ],
    },
  }))

  showSuccessMessage = () => NotificationManager.success("Decision tree was successfully edited.", "Thank you");

  deleteStep = (targetIndex) => () => this.setState(({ decisionTree }) => ({
    decisionTree: {
      ...decisionTree,
      steps: decisionTree.steps.filter((_step, index) => index !== targetIndex),
    },
  }))

  validate = () => {
    const { intro, steps } = this.state.decisionTree;
    const abbreviationValid = this.getAllAbreviationsLength() < 200;
    const introValid = intro.text && intro.goto !== null;
    const stepsValid = !steps.find((step) => ( // find an invalid step
      step.type === "question" ? (
        !step.text || step.answers.find((answer) => !answer.text || answer.goto === null)
      ) : (
        !step.text || step.goto === null
      )
    ));
    return introValid && stepsValid && abbreviationValid;
  }

  formatDecisionTree = () => ({
    ...this.state.decisionTree,
    menuItemId: this.props.menuItemId,
  })

  edit = () => this.setState({ isEditing: true });

  save = () => {
    if (this.validate()) {
      this.props.saveDecisionTree(this.formatDecisionTree());
    }
    this.showSuccessMessage();
    this.setState({ isEditing: false });
  }

  render() {
    const { isEditing, decisionTree } = this.state;
    const { intro, steps } = decisionTree;

    return (
      <>
        <NotificationContainer />
        <TextStep
          label="Intro"
          text={intro.text}
          abbreviation={intro.abbreviation}
          goto={intro.goto && intro.goto.toString()}
          steps={this.getStepsForSelect()}
          onChange={this.handleIntroChange}
          disabled={!isEditing}
        />
        {steps.map((step, index) => (
          step.type === "text" ? (
            <TextStep
              canDelete
              key={`Step ${index + 1}`}
              label={`Step ${index + 1} - Text Message`}
              text={step.text}
              abbreviation={step.abbreviation}
              goto={step.goto}
              steps={this.getStepsForSelect(index)}
              onChange={this.handleTextStepChange(index)}
              onDelete={this.deleteStep(index)}
              disabled={!isEditing}
            />
          ) : (
            <QuestionStep
              key={`Step ${index + 1}`}
              label={`Step ${index + 1} - Question`}
              text={step.text}
              abbreviation={step.abbreviation}
              answers={step.answers}
              steps={this.getStepsForSelect(index)}
              onChange={this.handleQuestionStepChange(index)}
              onDelete={this.deleteStep(index)}
              disabled={!isEditing}
            />
          )
        ))}
        {isEditing ? (
          <div className="DecisionTreeButtons">
            <div className="DecisionTreeCountdown">
              {"Available chars: "}
              <span
                className={cx({
                  DecisionTreeCountdownInvalid: this.getAllAbreviationsLength() > 200,
                })}
              >
                {this.getAllAbreviationsLength()}
                /200
              </span>
            </div>
            <Button
              onClick={this.newQuestionStep}
              className="DecisionTreeButton"
            >
              Add a question
            </Button>
            <Button
              onClick={this.newTextStep}
              className="DecisionTreeButton"
            >
              Add a text message
            </Button>
            <Button
              onClick={this.save}
              className="DecisionTreeButton"
              disabled={!this.validate()}
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="DecisionTreeButtons">
            <Button
              onClick={this.edit}
              className="DecisionTreeButton"
            >
              Edit
            </Button>
          </div>
        )}
      </>
    );
  }
}

DecisionTree.propTypes = {
  decisionTree: decisionTreePropType,
  saveDecisionTree: func.isRequired,
  menuItemId: number.isRequired,
};

DecisionTree.defaultProps = {
  decisionTree: {
    id: null,
    intro: {
      text: "",
      goto: null,
    },
    steps: [],
  },
};

const actions = {
  saveDecisionTree,
};

const DecisionTreeContainer = connect(null, actions)(DecisionTree);

export default DecisionTreeContainer;
