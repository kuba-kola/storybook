import React from "react";
import {
  func, node, string, oneOf, bool,
} from "prop-types";
import cx from "classnames";
import Button from "../Button";

import "./styles.scss";

const Modal = ({
  title,
  text,
  subtitle,
  cancelButtonText,
  submitButtonText,
  cancelButtonVariant,
  submitButtonVariant,
  submitDisabled,
  size,
  isForm,
  loading,
  children,
  onCancel,
  onSubmit,
}) => (
  <>
    <div className={cx("conciergeModal", {
      conciergeModalSmall: size === "small",
      conciergeModalMedium: size === "medium",
      conciergeModalLarge: size === "large",
    })}
    >
      <div className="conciergeModalHeader">
        <div className="display-flex">
          <p>{title}</p>
          {subtitle
            && (
            <>
              <i className="conciergeModalHeaderSeparator" />
              <p className="conciergeModalHeaderSubtitle">{subtitle}</p>
            </>
            )}
        </div>
        <Button
          icon="close"
          padding="small"
          onClick={loading ? null : () => onCancel()}
        />
      </div>
      {isForm
      && (
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="conciergeModalBody">
          {text
            && (
            <p className="conciergeModalBodyLabel">
              {text}
            </p>
            )}
          {children}
        </div>
        {!loading && (
        <div className="conciergeModalFooter">
          <Button
            variant="dark-outline"
            type="button"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant="brand"
            type="submit"
            disabled={submitDisabled}
          >
            {submitButtonText}
          </Button>
        </div>
        )}
      </form>
      )}
      {!isForm
      && (
      <>
        <div className="conciergeModalBody">
          {text
            && (
            <p className="conciergeModalBodyLabel">
              {text}
            </p>
            )}
          {children}
        </div>
        <div className="conciergeModalFooter">
          <Button
            variant={cancelButtonVariant}
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant={submitButtonVariant}
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            {submitButtonText}
          </Button>
        </div>
      </>
      )}
    </div>
    <button type="button" className="conciergeModalOverlay" />
  </>
);

Modal.propTypes = {
  title: string,
  text: string,
  subtitle: string,
  cancelButtonText: string,
  submitButtonText: string,
  cancelButtonVariant: oneOf([
    "base",
    "neutral",
    "aqua",
    "brand",
    "brand-outline",
    "dark",
    "dark-outline",
    "success",
    "destructive",
  ]),
  submitButtonVariant: oneOf([
    "base",
    "neutral",
    "aqua",
    "brand",
    "brand-outline",
    "dark",
    "dark-outline",
    "success",
    "destructive",
  ]),
  submitDisabled: bool,
  size: oneOf(["small", "medium", "large"]),
  isForm: bool,
  loading: bool,
  children: node,
  onCancel: func.isRequired,
  onSubmit: func.isRequired,
};

Modal.defaultProps = {
  title: "",
  text: "",
  subtitle: "",
  cancelButtonText: "Cancel",
  submitButtonText: "Submit",
  cancelButtonVariant: "dark-outline",
  submitButtonVariant: "brand",
  submitDisabled: false,
  size: "medium",
  isForm: false,
  loading: false,
  children: null,
};

export default Modal;
