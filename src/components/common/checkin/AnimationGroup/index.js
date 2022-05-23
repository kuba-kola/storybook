import React, { Fragment } from "react";
import { bool, node } from "prop-types";

import { TransitionGroup } from "react-transition-group";

const AnimationGroup = ({ isComplete, children }) => (isComplete ? (
  <>{children}</>
) : (
  <TransitionGroup appear component={null}>
    {children}
  </TransitionGroup>
));

AnimationGroup.propTypes = {
  isComplete: bool,
  children: node.isRequired,
};

AnimationGroup.defaultProps = {
  isComplete: false,
};

export default AnimationGroup;
