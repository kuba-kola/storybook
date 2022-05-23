import React, { useRef, useState } from "react";
import { func } from "prop-types";

import { useOutsideClick } from "shared/hooks";

import "../styles.scss";

const initialState = {
  popupStepIndex: 0,
  overcapacity: null,
  walkin: null,
  isPopupVisible: false,
};

const OvercapacityPopup = ({
  onClose,
  onSubmit,
}) => {
  const [state, setState] = useState(initialState);

  const popupRef = useRef(null);
  useOutsideClick(popupRef, () => onClose());

  const handleOvercapacityPopupClick = (value) => {
    if (state.popupStepIndex === 0) {
      setState({
        ...state,
        popupStepIndex: state.popupStepIndex + 1,
        overcapacity: value,
        isPopupVisible: value,
      });
    } else {
      setState({
        ...state,
        popupStepIndex: 0,
        walkin: value,
        isPopupVisible: false,
      });
    }

    if (state.popupStepIndex === 0 && !value) {
      onClose();
    }

    if (state.popupStepIndex === 1) {
      onSubmit(state.overcapacity, value);
      onClose();
    }
  };

  return (
    <div
      className="timePickerPopup"
      ref={popupRef}
    >
      <div className="timePickerPopupTitle">
        {state.popupStepIndex === 0 ? "Are you sure?" : "Is this walk-in?"}
      </div>
      <div className="timePickerPopupButtons">
        <button
          type="button"
          className="timePickerPopupButton"
          onClick={() => handleOvercapacityPopupClick(false)}
        >
          No
        </button>
        <button
          type="button"
          className="timePickerPopupButton timePickerPopupButtonDark"
          onClick={() => handleOvercapacityPopupClick(true)}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

OvercapacityPopup.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
};

export default OvercapacityPopup;
