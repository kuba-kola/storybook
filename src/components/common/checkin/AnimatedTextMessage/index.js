import React from "react";
import {
  number, oneOf, string, bool,
} from "prop-types";

import { DELAY_500 } from "shared/constants/delays";
import Animation from "components/common/checkin/Animation";
import TextMessage from "components/common/checkin/TextMessage";
import { SOURCE_CONCIERGE, SOURCE_USER } from "shared/constants/text-messages";

const AnimatedTextMessage = ({
  delay,
  source,
  message,
  isOpening,
  isClosing,
  isBig,
  ...animationProps
}) => (
  <Animation delay={delay} {...animationProps}>
    <TextMessage
      source={source}
      message={message}
      isOpening={isOpening}
      isClosing={isClosing}
      isBig={isBig}
      speechDelay={delay + DELAY_500} // DELAY_500 is the duration of most animations
    />
  </Animation>
);

AnimatedTextMessage.propTypes = {
  delay: number,
  source: oneOf([SOURCE_CONCIERGE, SOURCE_USER]).isRequired,
  message: string.isRequired,
  isOpening: bool,
  isClosing: bool,
  isBig: bool,
};

AnimatedTextMessage.defaultProps = {
  delay: 0,
  isOpening: false,
  isClosing: false,
  isBig: false,
};

export default AnimatedTextMessage;
