import React from "react";
import { number } from "prop-types";
import Lottie from "react-lottie";

import { DELAY_500 } from "shared/constants/delays";
import { UNFOLD_RIGHT } from "shared/constants/animations";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import * as typingAnimation from "assets/animations/typing.json";
import styles from "./styles.module.scss";

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: typingAnimation.default,
};

const LoadingState = ({ delay }) => (
  <AnimationGroup>
    <Animation type={UNFOLD_RIGHT} delay={delay}>
      <div className={styles.container}>
        <Lottie options={lottieOptions} />
      </div>
    </Animation>
  </AnimationGroup>
);

LoadingState.propTypes = {
  delay: number,
};

LoadingState.defaultProps = {
  delay: DELAY_500,
};

export default LoadingState;
