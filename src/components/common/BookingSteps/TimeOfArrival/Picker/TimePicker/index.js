import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import {
  func, arrayOf, string, bool,
} from "prop-types";
import { ReactComponent as IconArrowLeft } from "assets/images/arrow/left.svg";
import { ReactComponent as IconArrowRight } from "assets/images/arrow/right.svg";
import OvercapacityPopup from "./OvercapacityPopup";
import TimeSlot from "./TimeSlot";

import { TIME_PICKER_TIMELIST, TIME_PICKER_SLIDES } from "./utils";

import "./styles.scss";

const TimePicker = ({
  timeArr,
  time,
  setTime,
  isHoursOnly,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [overcapacityTimeSlot, setOvercapacityTimeSlot] = useState(null);

  useEffect(() => {
    if (time) {
      for (let i = 0; i < TIME_PICKER_SLIDES.length; i += 1) {
        const [startIndex, endIndex] = TIME_PICKER_SLIDES[i].slice;
        const realIndex = TIME_PICKER_TIMELIST.indexOf(time || timeArr[0]);
        if (realIndex >= startIndex && realIndex < endIndex) {
          setSlideIndex(i);
        }
      }
    } else {
      setSlideIndex(0);
    }
  }, [time, timeArr]);

  const handleTimeSlotClick = (timeSlot) => {
    if (timeArr.find((t) => t === timeSlot)) {
      setTime(timeSlot);
    } else {
      setOvercapacityTimeSlot(timeSlot);
    }
  };

  return (
    <div className="timePicker">
      <div className="timePickerHeader">
        <button
          type="button"
          className={cx("timePickerHeaderBtn", "btn")}
          onClick={() => setSlideIndex(slideIndex - 1)}
          disabled={slideIndex === 0}
        >
          <IconArrowLeft />
        </button>
        <div className="timePickerHeaderText">{TIME_PICKER_SLIDES[slideIndex].title}</div>
        <button
          type="button"
          className={cx("timePickerHeaderBtn", "btn")}
          onClick={() => setSlideIndex(slideIndex + 1)}
          disabled={slideIndex === 4}
        >
          <IconArrowRight />
        </button>
      </div>
      <div className="timePickerView">
        {TIME_PICKER_TIMELIST.slice(...TIME_PICKER_SLIDES[slideIndex].slice).map((timeSlot) => {
          if (isHoursOnly && +timeSlot.slice(-2) !== 0) return null;
          return (
            <TimeSlot
              key={timeSlot}
              timeSlot={timeSlot}
              isActive={timeSlot === time || timeSlot === overcapacityTimeSlot}
              disabled={!timeArr.find((t) => t === timeSlot)}
              onClick={() => handleTimeSlotClick(timeSlot)}
            />
          );
        })}
      </div>
      {overcapacityTimeSlot && (
        <OvercapacityPopup
          onClose={() => setOvercapacityTimeSlot(null)}
          onSubmit={(overcapacity, walkin) => {
            setTime(overcapacityTimeSlot, overcapacity, walkin);
          }}
        />
      )}
    </div>
  );
};

TimePicker.propTypes = {
  timeArr: arrayOf(string).isRequired,
  time: string,
  setTime: func.isRequired,
  isHoursOnly: bool,
};

TimePicker.defaultProps = {
  time: null,
  isHoursOnly: false,
};

export default TimePicker;
