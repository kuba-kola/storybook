import React, { Component } from "react";
import {
  string, instanceOf, bool, object, func, arrayOf, number, shape, oneOfType,
} from "prop-types";
import dateFns from "date-fns";
import cx from "classnames";
import { equals } from "ramda";
import enhanceWithClickOutside from "react-click-outside";
import Calendar from "components/common/DatePicker/Calendar";
import Panel from "components/common/Panel";
import Button from "components/common/Button";
import { checkEndDateWithStartDate } from "shared/utils/datetime";
import DatePickerInput from "./DatePickerInput";

import "./styles.scss";

const HOURS = 23;
const MINUTES = 59;
const SECONDS = 59;

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRange: this.props.previousDates,
      startDate: this.props.defaultStartDate,
      endDate: this.props.defaultEndDate,
      startDateInputValue: this.props.defaultStartDate
        ? dateFns.format(this.props.defaultStartDate, this.props.format)
        : "",
      endDateInputValue: this.props.defaultEndDate
        ? dateFns.format(this.props.defaultEndDate, this.props.format)
        : "",
      startDateWasInUse: false,
      endDateWasInUse: false,
      isCalendarOpen: false,
      isSelectingRange: false,
      isDateChanged: false,
      startDateError: null,
      endDateError: null,
    };
  }

  componentDidMount() {
    const { from, rawTo } = this.props.previousDates;

    if (from || rawTo) {
      this.handleStartSelectFromCalendar(from);
      this.handleEndSelectFromCalendar(rawTo);
    }
  }

  validateStartDate = (value) => {
    if (!this.state.startDateWasInUse || !value.length) {
      this.setState({ startDateError: null });
      return true;
    }
    return this.commonInputValidate(value, "startDateError");
  }

  validateEndDate = (value) => {
    const { startDate, startDateInputValue, endDateWasInUse } = this.state;
    const {
      format,
      dateValidationError,
      endDateValidationError,
      separator,
      parseDateInFormat,
    } = this.props;

    if (!endDateWasInUse || !value.length) {
      this.setState({ endDateError: null });
      return true;
    }
    const parsedValue = parseDateInFormat(value, separator);
    const commonValidateResult = this.commonInputValidate(value, "endDateError");
    const isAfterStartDate = checkEndDateWithStartDate(
      parsedValue,
      startDate,
      startDateInputValue,
      format,
    );
    const result = commonValidateResult && isAfterStartDate;
    const errorText = !isAfterStartDate ? endDateValidationError : dateValidationError;

    this.setState({ endDateError: result ? null : errorText });
    return result;
  }

  commonInputValidate = (value, errorFieldName) => {
    const {
      formatRegExp,
      separator,
      parseDateInFormat,
      dateValidationError,
    } = this.props;
    const isMatchingRegExp = value.match(formatRegExp);
    const isValueDate = dateFns.isValid(parseDateInFormat(value, separator));
    const result = isMatchingRegExp && isValueDate;

    this.setState({ [errorFieldName]: result ? null : dateValidationError });
    return result;
  }

  handleClickOutside = () => {
    this.setState({ isCalendarOpen: false });
  }

  handleStartSelectFromCalendar = (date) => {
    this.setState({
      startDate: date,
      startDateInputValue: dateFns.format(date, this.props.format),
      startDateError: null,
      isDateChanged: true,
    });
    if (this.props.onSelectChange) {
      this.props.onSelectChange(date);
    }

    if (this.props.rangeMode) {
      this.setState({ isSelectingRange: true });
    }
  }

  handleEndSelectFromCalendar = (date) => {
    if (!this.props.isSingleDateSelect) {
      if (date && date.getHours() !== HOURS) {
        date.setHours(HOURS, MINUTES, SECONDS);
      }

      this.setState({
        endDate: date,
        endDateInputValue: date ? dateFns.format(date, this.props.format) : "",
        isSelectingRange: !date,
        isDateChanged: true,
        endDateError: null,
      });
    }
  }

  handleStartDateBlur = () => this.setState({ startDateWasInUse: true })

  handleEndDateBlur = () => this.setState({ endDateWasInUse: true })

  openCalendar = () => this.setState({ isCalendarOpen: true })

  closeCalendar = () => this.setState({ isCalendarOpen: false })

  toggleCalendar = () => {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState(({ isCalendarOpen }) => ({ isCalendarOpen: !isCalendarOpen }));
    }
  }

  checkIfDatesCanBeApplied = () => {
    const { previousDates, previousDatesNaming, rangeMode } = this.props;
    const { startDate, endDate } = this.state;
    const isStartEquals = equals(previousDates[previousDatesNaming.startDate], startDate);
    const isEndEquals = rangeMode && equals(previousDates[previousDatesNaming.endDate], endDate);

    return rangeMode ? !isStartEquals || !isEndEquals : !isStartEquals;
  }

  applyChanges = () => {
    const { rangeMode } = this.props;
    const { startDate, endDate } = this.state;
    if (!this.checkIfDatesCanBeApplied()) return;

    if (startDate && !endDate) {
      // we make copy of date object
      const end = new Date(startDate.getTime());
      end.setHours(HOURS);
      end.setMinutes(MINUTES);
      end.setSeconds(SECONDS);

      this.handleEndSelectFromCalendar(end);
      this.props.onEndDateChange(end);
    }
    this.props.onStartDateChange(startDate);
    if (rangeMode && endDate) {
      this.props.onEndDateChange(endDate);
    }
    this.closeCalendar();
    this.setState({ isDateChanged: false });
  }

  resetChanges = () => {
    const {
      rangeMode,
      format,
      onResetChanges,
    } = this.props;

    const { initialRange } = this.state;

    this.setState({
      startDate: initialRange.from,
      startDateInputValue: dateFns.format(initialRange.from, format),
    });

    if (rangeMode) {
      this.setState({
        endDate: initialRange.rawTo,
        endDateInputValue: dateFns.format(initialRange.rawTo, format),
      });
    }

    onResetChanges();
    this.closeCalendar();
    this.setState({ isDateChanged: false });
  }

  cancelChanges = () => {
    const {
      previousDates,
      previousDatesNaming,
      rangeMode,
      format,
    } = this.props;

    if (!this.checkIfDatesCanBeApplied()) {
      return;
    }

    this.setState({
      startDate: previousDates[previousDatesNaming.startDate],
      startDateInputValue:
        previousDates[previousDatesNaming.startDate]
          ? dateFns.format(previousDates[previousDatesNaming.startDate], format) : "",
    });

    if (rangeMode) {
      this.setState({
        endDate: previousDates[previousDatesNaming.endDate],
        endDateInputValue:
          previousDates[previousDatesNaming.endDate]
            ? dateFns.format(previousDates[previousDatesNaming.endDate], format) : "",
      });
    }

    this.closeCalendar();
    this.setState({ isDateChanged: false });
  }

  render() {
    const {
      format,
      startDateLabel,
      endDateLabel,
      disabled,
      rangeMode,
      calendarProps,
    } = this.props;
    const {
      startDateInputValue,
      endDateInputValue,
      isCalendarOpen,
      startDate,
      endDate,
      isSelectingRange,
      isDateChanged,
      startDateError,
      endDateError,
    } = this.state;
    const textFieldPlaceholder = format.toLowerCase();

    return (
      <section className="conciergeDatepickerWrapper">
        <section className="conciergeDatepickerInputWrapper">
          <DatePickerInput
            placeholder={textFieldPlaceholder}
            label={startDateLabel}
            value={startDateInputValue}
            disabled={disabled}
            onBlur={this.handleStartDateBlur}
            onFocus={this.openCalendar}
            error={startDateError}
          />
          {rangeMode ? (
            <DatePickerInput
              placeholder={textFieldPlaceholder}
              value={endDateInputValue}
              label={endDateLabel}
              disabled={disabled}
              onBlur={this.handleEndDateBlur}
              onFocus={this.openCalendar}
              error={endDateError}
            />
          ) : null}
        </section>
        <Panel
          className={
            cx(
              "conciergeDatepickerCalendarContainer",
              {
                "conciergeDatepickerCalendarContainer-open": isCalendarOpen,
              },
            )
          }
        >
          <Calendar
            onStartDateSelect={this.handleStartSelectFromCalendar}
            onEndDateSelect={this.handleEndSelectFromCalendar}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
            isSelectingRange={isSelectingRange}
            rangeMode={rangeMode}
            timezone={this.props.timezone}
            {...calendarProps}
          />
          {this.props.isButtonShown && (
            <section className="conciergeDatepickerButtonsWrapper">
              <Button
                className="conciergeDatepickerButton conciergeDatepickerButton-reset"
                onClick={this.resetChanges}
              >
                Reset
              </Button>
              <Button
                className="conciergeDatepickerButton conciergeDatepickerButton-apply"
                onClick={this.applyChanges}
                disabled={!isDateChanged}
              >
                Apply
              </Button>
              <Button
                className="conciergeDatepickerButton conciergeDatepickerButton-cancel"
                onClick={this.cancelChanges}
                disabled={!isDateChanged}
              >
                Cancel
              </Button>
            </section>
          )}
        </Panel>
      </section>
    );
  }
}

DatePicker.propTypes = {
  defaultStartDate: oneOfType([instanceOf(Date), string]),
  defaultEndDate: instanceOf(Date),
  previousDates: oneOfType([instanceOf(Date), string]),
  previousDatesNaming: shape({
    startDate: string,
    endDate: string,
  }),
  rangeMode: bool,
  disabled: bool,
  format: string.isRequired,
  separator: string.isRequired,
  formatRegExp: instanceOf(RegExp).isRequired,
  separatorPositions: arrayOf(number).isRequired,
  parseDateInFormat: func.isRequired,
  startDateLabel: string,
  endDateLabel: string,
  onStartDateChange: func,
  onEndDateChange: func,
  onResetChanges: func,
  // eslint-disable-next-line react/forbid-prop-types
  calendarProps: object,
  dateValidationError: string,
  endDateValidationError: string,
  isSingleDateSelect: bool,
  onSelectChange: func,
  isButtonShown: bool,
  timezone: string,
};

DatePicker.defaultProps = {
  defaultStartDate: null,
  defaultEndDate: null,
  previousDates: null,
  previousDatesNaming: null,
  rangeMode: false,
  disabled: false,
  startDateLabel: "Start Date",
  endDateLabel: "End Date",
  onStartDateChange: () => {},
  onEndDateChange: () => {},
  onResetChanges: () => {},
  calendarProps: {},
  dateValidationError: "Invalid date",
  endDateValidationError: "End date should be after start date",
  isSingleDateSelect: false,
  onSelectChange: () => {},
  isButtonShown: true,
  timezone: "",
};

export default enhanceWithClickOutside(DatePicker);
