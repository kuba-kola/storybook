import React, { Component } from "react";
import {
  instanceOf, bool, func, number, string, oneOfType,
} from "prop-types";
import { convertToTimeZone } from "date-fns-timezone";
import dateFns from "date-fns";

import {
  YEAR_FORMAT,
  WEEK_DAY_FORMAT,
  MONTH_FORMAT,
} from "shared/utils/datetime";
import { times } from "shared/utils/common";
import DayCell from "components/common/DatePicker/DayCell";
import Input from "components/common/Input";

import "./styles.scss";

const yearRegexp = /^[\d]{4}$/;
class Calendar extends Component {
  constructor(props) {
    super(props);
    const today = convertToTimeZone(new Date(), { timeZone: this.props.timezone });
    this.state = {
      currentMonth: this.props.selectedStartDate || today,
      yearValue: this.props.selectedStartDate
        ? dateFns.format(this.props.selectedStartDate, YEAR_FORMAT)
        : dateFns.format(today, YEAR_FORMAT),
      isSelectingRange: false,
      supposedLastDate: null,
    };
  }

  onDateSelection = (date, monthStart) => {
    if (!dateFns.isSameMonth(date, monthStart)) return;
    if (this.props.isSelectingRange || this.state.isSelectingRange) {
      this.handleLastSelect(date);
    } else {
      this.handleFirstSelect(date);
    }
  }

  nextMonth = () => {
    this.setState(({ currentMonth }) => ({
      currentMonth: dateFns.addMonths(currentMonth, 1),
    }));
    this.setState(({ currentMonth }) => ({
      yearValue: dateFns.format(currentMonth, YEAR_FORMAT),
    }));
  }

  prevMonth = () => {
    this.setState(({ currentMonth }) => ({
      currentMonth: dateFns.subMonths(currentMonth, 1),
    }));
    this.setState(({ currentMonth }) => ({
      yearValue: dateFns.format(currentMonth, YEAR_FORMAT),
    }));
  }

  changeYear = (year) => {
    this.setState({ yearValue: year });
    if (year.match(yearRegexp)) {
      this.setState(({ currentMonth }) => ({ currentMonth: dateFns.setYear(currentMonth, year) }));
    }
  }

  handleYearInputBlur = () => {
    const { yearValue, currentMonth } = this.state;
    if (!yearValue.match(yearRegexp)) {
      this.setState({ yearValue: dateFns.format(currentMonth, YEAR_FORMAT) });
    }
  }

  handleFirstSelect = (date) => {
    const { onStartDateSelect, onEndDateSelect, rangeMode } = this.props;
    onStartDateSelect(date);
    if (rangeMode) {
      onEndDateSelect(null);
    }
    if (rangeMode && !this.hasOuterSelectionIndicator()) {
      this.setState({ isSelectingRange: true });
    }
  }

  handleLastSelect = (date) => {
    const { selectedStartDate, onEndDateSelect, onStartDateSelect } = this.props;
    this.setState({ supposedLastDate: null });
    if (!this.hasOuterSelectionIndicator()) {
      this.setState({ isSelectingRange: false });
    }
    if (dateFns.isAfter(date, selectedStartDate)) {
      onEndDateSelect(date);
    } else {
      onStartDateSelect(date);
      onEndDateSelect(selectedStartDate);
    }
  }

  hasOuterSelectionIndicator = () => this.props.isSelectingRange !== null

  buildWeekDays() {
    const countOfWeekDays = 7;

    const dayToStart = dateFns.startOfWeek(this.state.currentMonth, {
      weekStartsOn: this.props.startOfWeek,
    });

    const dayNames = times(countOfWeekDays).map((index) => (
      <div className="conciergeCalendarWeekDay" key={index}>
        {dateFns.format(dateFns.addDays(dayToStart, index), WEEK_DAY_FORMAT)}
      </div>
    ));
    return dayNames;
  }

  buildDaysGrid() {
    const { currentMonth, supposedLastDate, isSelectingRange: isSelectingRangeOwn } = this.state;
    const {
      startOfWeek,
      rangeMode,
      selectedStartDate,
      selectedEndDate,
      isSelectingRange,
    } = this.props;
    const countOfWeekDays = 7;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: startOfWeek });
    const endDate = dateFns.endOfWeek(monthEnd, { weekStartsOn: startOfWeek });

    const rows = [];
    let days = [];
    let day = startDate;
    const today = convertToTimeZone(new Date(), { timeZone: this.props.timezone });

    while (day <= endDate) {
      // eslint-disable-next-line no-loop-func
      times(countOfWeekDays).forEach((index) => {
        const dayClone = day;
        const isOutOfMonth = !dateFns.isSameMonth(day, monthStart);
        const isCurrent = dateFns.isSameDay(day, today);
        const isSelected = dateFns.isSameDay(day, selectedStartDate)
          || dateFns.isSameDay(day, selectedEndDate)
          || dateFns.isSameDay(day, supposedLastDate);
        const isWithinRange = () => {
          const endDateToCompare = supposedLastDate || selectedEndDate;
          const hasBothDates = selectedStartDate && endDateToCompare;
          const isInSequentialRange = dateFns.isAfter(endDateToCompare, selectedStartDate)
            && dateFns.isWithinRange(day, selectedStartDate, endDateToCompare);
          const isInReverseRange = dateFns.isBefore(endDateToCompare, selectedStartDate)
            && dateFns.isWithinRange(day, endDateToCompare, selectedStartDate);
          const result = rangeMode && hasBothDates && (isInSequentialRange || isInReverseRange);
          return Boolean(result);
        };
        const isStartOfRange = rangeMode
          && ((dateFns.isSameDay(day, selectedStartDate)
            && ((supposedLastDate && dateFns.isBefore(day, supposedLastDate))
              || (selectedEndDate && dateFns.isBefore(day, selectedEndDate))))
            || ((supposedLastDate || selectedEndDate)
              && (dateFns.isSameDay(day, supposedLastDate)
                || dateFns.isSameDay(day, selectedEndDate))
              && dateFns.isBefore(day, selectedStartDate)));
        const isEndOfRange = rangeMode
          && ((dateFns.isSameDay(day, selectedStartDate)
            && (supposedLastDate || selectedEndDate)
            && (dateFns.isAfter(day, supposedLastDate) || dateFns.isAfter(day, selectedEndDate)))
            || (supposedLastDate
              && dateFns.isSameDay(day, supposedLastDate)
              && dateFns.isAfter(day, selectedStartDate))
            || (selectedEndDate && dateFns.isSameDay(day, selectedEndDate)));
        const handleMouseEnter = () => {
          if (rangeMode && (isSelectingRange || isSelectingRangeOwn)) {
            this.setState({ supposedLastDate: dayClone });
          }
        };
        const handleMouseLeave = () => {
          if (rangeMode && (isSelectingRange || isSelectingRangeOwn)) {
            this.setState({ supposedLastDate: null });
          }
        };
        days.push((
          <DayCell
            key={day}
            day={day}
            today={today}
            isOutOfMonth={isOutOfMonth}
            isWithinRange={isWithinRange()}
            isCurrent={isCurrent}
            isSelected={isSelected}
            isStartOfRange={isStartOfRange}
            isEndOfRange={isEndOfRange}
            rangeMode={rangeMode}
            isFirst={index === 0}
            isLast={index === 6}
            onClick={() => {
              this.onDateSelection(dayClone, monthStart);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ));
        day = dateFns.addDays(day, 1);
      });
      rows.push(<div className="conciergeCalendarDaysRow" key={day}>{days}</div>);
      days = [];
    }
    return rows;
  }

  render() {
    return (
      <section className="conciergeCalendarWrapper">
        <section className="conciergeCalendarNavigation">
          <div className="conciergeCalendarIcon prevMonth" onClick={this.prevMonth} />
          <div className="conciergeCalendarMonthYearWrapper">
            <span className="conciergeCalendarMonthName">
              {dateFns.format(this.state.currentMonth, MONTH_FORMAT)}
            </span>
            <Input
              value={this.state.yearValue}
              onChange={this.changeYear}
              onBlur={this.handleYearInputBlur}
              inputClassName="conciergeCalendarYear"
            />
          </div>
          <div className="conciergeCalendarIcon nextMonth" onClick={this.nextMonth} />
        </section>
        <section>
          <div className="conciergeCalendarWeekDaysRow">{this.buildWeekDays()}</div>
          {this.buildDaysGrid()}
        </section>
      </section>
    );
  }
}

Calendar.propTypes = {
  selectedStartDate: oneOfType([instanceOf(Date), string]),
  selectedEndDate: oneOfType([instanceOf(Date), string]),
  isSelectingRange: bool,
  onStartDateSelect: func.isRequired,
  fetchDealershipInfo: func.isRequired,
  onEndDateSelect: func,
  rangeMode: bool,
  startOfWeek: number,
  token: string.isRequired,
  dealershipId: oneOfType([string, number]).isRequired,
  timezone: string,
};

Calendar.defaultProps = {
  selectedStartDate: null,
  selectedEndDate: null,
  isSelectingRange: null,
  onEndDateSelect: null,
  rangeMode: false,
  startOfWeek: 0,
  timezone: "",
};

export default Calendar;
