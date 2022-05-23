import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { func, arrayOf, bool } from "prop-types";
import dateFns from "date-fns";

import { daySlotPropType, chosenTimeSlotPropType } from "shared/prop-types";

import { ReactComponent as IconArrowLeft } from "assets/images/arrow/left.svg";
import { ReactComponent as IconArrowRight } from "assets/images/arrow/right.svg";
import TimePicker from "./TimePicker";

import "./styles.scss";

const TimeOfArrivalPicker = ({
  days,
  chosenTimeSlot,
  onSetTimeSlot,
  onReset,
  isRemote,
}) => {
  const [currentDate, setCurrentDate] = useState(dateFns.parse(chosenTimeSlot?.day?.full_date || days[0].full_date, "YYYY-MM-DD"));
  const [time, setTime] = useState(chosenTimeSlot.quarterSlot);
  const [timeArr, setTimeArr] = useState(days[0].slots);
  const [minDate] = useState(new Date());
  const [maxDate] = useState(new Date(minDate.getFullYear() + 3, minDate.getMonth(), minDate.getDate()));

  const getDayByDate = (date) => {
    const day = days.find((el) => el.full_date === dateFns.format(date, "YYYY-MM-DD"));
    if (day) {
      return day;
    }
    return {
      id: +date,
      short_day_name: dateFns.format(date, "ddd").toLocaleLowerCase(),
      day_name: dateFns.format(date, "dddd"),
      day_of_month: dateFns.format(date, "MMMM, D"),
      full_date: dateFns.format(date, "YYYY-MM-DD"),
      slots: [],
      overcapacity: true,
    };
  };

  useEffect(() => {
    if (chosenTimeSlot.day) {
      setCurrentDate(dateFns.parse(chosenTimeSlot.day.full_date, "YYYY-MM-DD"));
      setTime(chosenTimeSlot.quarterSlot);
      const chosenDay = days.find((item) => item.full_date === chosenTimeSlot.day.full_date);
      setTimeArr(chosenDay ? chosenDay.slots : days[0].slots);
    }
  }, [chosenTimeSlot]);

  useEffect(() => {
    if (chosenTimeSlot.day) {
      const chosenDay = days.find((item) => item.full_date === chosenTimeSlot.day.full_date);
      setTimeArr(chosenDay ? chosenDay.slots : days[0].slots);
    } else {
      setTimeArr(days[0].slots);
    }
  }, [days]);

  const onChangeDate = (changeDate) => {
    setCurrentDate(changeDate);
    setTimeArr(getDayByDate(changeDate).slots);
    onReset();
    setTime(null);
  };

  const onSetTime = (t, overcapacity, walkin) => {
    if (t === time) {
      onReset();
      setTime(null);
    } else {
      setTime(t);
      onSetTimeSlot(t, getDayByDate(currentDate), overcapacity, walkin);
    }
  };

  return (
    <div className="pickerWrapper">
      <div className="pickerColumn">
        <div className="pickerColumnTitle">Pick the date</div>
        <Calendar
          onChange={onChangeDate}
          value={currentDate}
          minDate={minDate}
          maxDate={maxDate}
          locale="en-US"
          calendarType="US"
          className="customCalendar"
          defaultValue={currentDate}
          minDetail="year"
          prevLabel={<IconArrowLeft />}
          nextLabel={<IconArrowRight />}
          formatShortWeekday={(locale, d) => dateFns.format(d, "dd")}
          formatMonthYear={(locale, d) => dateFns.format(d, "MMMM, YYYY")}
          tileDisabled={({ date }) => !getDayByDate(date)}
          tileClassName={({ date }) => (getDayByDate(date).overcapacity ? "tileOvercapacity" : "")}
        />
      </div>
      <div className="pickerColumn">
        <div className="pickerColumnTitle">Available hours</div>
        <TimePicker
          timeArr={!getDayByDate(currentDate) ? [] : timeArr}
          time={time}
          setTime={onSetTime}
          isHoursOnly={isRemote}
        />
      </div>
    </div>
  );
};

TimeOfArrivalPicker.propTypes = {
  days: arrayOf(daySlotPropType).isRequired,
  chosenTimeSlot: chosenTimeSlotPropType.isRequired,
  onSetTimeSlot: func.isRequired,
  onReset: func.isRequired,
  isRemote: bool.isRequired,
};

export default TimeOfArrivalPicker;
