import React from "react";

import AnimationGroup from "components/common/checkin/AnimationGroup";
import Animation from "components/common/checkin/Animation";
import { DELAY_500 } from "shared/constants/delays";
import { SLIDE_UP } from "shared/constants/animations";

const animationWrapper = (Component, delay = DELAY_500, type = SLIDE_UP) => (
  props,
) => (
  <AnimationGroup>
    <Animation type={type} delay={delay}>
      <Component {...props} />
    </Animation>
  </AnimationGroup>
);

export default animationWrapper;
