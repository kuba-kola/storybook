import React, { Fragment } from "react";
import { string, bool } from "prop-types";

import { SOURCE_CONCIERGE } from "shared/constants/text-messages";
import AnimationGroup from "components/common/checkin/AnimationGroup";
import AnimatedTextMessage from "components/common/checkin/AnimatedTextMessage";

const ErrorStep = ({ error, canRetry }) => (
  <AnimationGroup>
    {canRetry ? (
      <>
        <AnimatedTextMessage
          message={error || "Sorry, our application servers responded with an error."}
          source={SOURCE_CONCIERGE}
          isOpening
        />
        <AnimatedTextMessage
          message="You can come back later or retry the failed request now."
          source={SOURCE_CONCIERGE}
          isClosing
        />
      </>
    ) : (
      <AnimatedTextMessage
        message={error || "An application error has occured. Please try again later."}
        source={SOURCE_CONCIERGE}
        isClosing
      />
    )}
  </AnimationGroup>
);

ErrorStep.propTypes = {
  error: string,
  canRetry: bool,
};

ErrorStep.defaultProps = {
  error: "",
  canRetry: false,
};

export default ErrorStep;
