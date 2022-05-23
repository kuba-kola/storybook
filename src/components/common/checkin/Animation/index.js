import React from "react";
import { number, node, oneOf } from "prop-types";
import { CSSTransition } from "react-transition-group";
import { UNFOLD_RIGHT, SLIDE_UP, FADE_IN } from "shared/constants/animations";

// eslint-disable-next-line no-unused-vars
import styles from "./styles.module.scss";

const TIMEOUT = 1500;

const Animation = ({
  delay, type, children, ...props
}) => (
  // <CSSTransition classNames={type} timeout={TIMEOUT + delay} {...props}>
  <div className={`animation transition-delay-${delay}`}>{children}</div>
  // </CSSTransition>
);

Animation.propTypes = {
  delay: number,
  type: oneOf([SLIDE_UP, UNFOLD_RIGHT, FADE_IN]),
  children: node.isRequired,
};

Animation.defaultProps = {
  type: SLIDE_UP,
  delay: 0,
};

export default Animation;
