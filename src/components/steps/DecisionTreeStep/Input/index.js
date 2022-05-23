import React from "react";
import {
  func, string, number, arrayOf, oneOfType, shape, bool,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import InlineSVG from "react-inlinesvg";
import Carousel from "nuka-carousel";

import { nextDecisionTreeStep } from "store/actions/checkin-decision-trees-actions";
import Button from "components/common/checkin/Button";

import leftIcon from "assets/icons/left.svg";
import rightIcon from "assets/icons/right.svg";
import styles from "./styles.module.scss";

class DecisionTreeStepInput extends React.Component {
  state = {
    carouselIndex: 0,
  };

  canSlideLeft = () => this.state.carouselIndex > 0;

  canSlideRight = () => this.state.carouselIndex < this.props.answers.length - 1;

  slideLeft = () => {
    if (this.canSlideLeft()) {
      this.setState({
        carouselIndex: this.state.carouselIndex - 1,
      });
    }
  };

  slideRight = () => {
    if (this.canSlideRight()) {
      this.setState({
        carouselIndex: this.state.carouselIndex + 1,
      });
    }
  };

  render() {
    const {
      serviceId, answers, onSubmitAnswer, isComplete,
    } = this.props;
    const { carouselIndex } = this.state;
    return !isComplete && answers ? (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button
              onClick={this.slideLeft}
              className={cx(styles.navigationButton, {
                [styles.disabled]: !this.canSlideLeft(),
              })}
            >
              <InlineSVG src={leftIcon} />
            </button>
            <button
              onClick={this.slideRight}
              className={cx(styles.navigationButton, {
                [styles.disabled]: !this.canSlideRight(),
              })}
            >
              <InlineSVG src={rightIcon} />
            </button>
          </div>
          <Carousel
            slideIndex={carouselIndex}
            afterSlide={(newIndex) => this.setState({ carouselIndex: newIndex })}
            renderCenterLeftControls={null}
            renderCenterRightControls={null}
            renderBottomCenterControls={null}
            slideWidth="150px"
            framePadding="15px 0"
            cellSpacing={10}
            height="auto"
          >
            {answers.map((answer, index) => (
              <div style={{ padding: "4px 0" }}>
                <Button
                  key={answer.text + answer.goto}
                  caption={answer.text}
                  onClick={() => {
                    onSubmitAnswer(serviceId, answer.goto, answer.text);
                    this.setState({
                      carouselIndex: 0,
                    });
                  }}
                  isSecondary
                  isWide
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    ) : null;
  }
}

DecisionTreeStepInput.propTypes = {
  serviceId: number,
  answers: arrayOf(
    shape({
      text: string,
      goto: oneOfType([string, number]),
    }),
  ),
  onSubmitAnswer: func.isRequired,
  isComplete: bool,
};

DecisionTreeStepInput.defaultProps = {
  serviceId: null,
  answers: null,
  isComplete: false,
};

const actions = {
  onSubmitAnswer: nextDecisionTreeStep,
};

const DecisionTreeStepInputContainer = connect(null, actions)(DecisionTreeStepInput);

export default DecisionTreeStepInputContainer;
