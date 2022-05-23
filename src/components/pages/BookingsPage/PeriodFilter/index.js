import React from "react";
import {
  func, shape, instanceOf, string,
} from "prop-types";
import { connect } from "react-redux";
import DatePicker from "components/common/DatePicker";
import {
  convertFilterTime,
  parseBookingsDatePickerDate,
  BOOKINGS_DATEPICKER_DATE_FORMAT,
  BOOKINGS_DATEPICKER_DATE_FORMAT_REGEXP,
} from "shared/utils/datetime";
import { setPeriodFilter, setTimelineFilter, resetTimelineFilters } from "store/actions/bookings-actions";
import { settingsTimezoneSelector } from "store/selectors/settings-selectors";
import { bookingsPeriodFiltersSelector } from "store/selectors/bookings-selectors";

import "./styles.scss";

const PeriodFilter = ({
  setFilter,
  setTimelineFilter,
  resetTimelineFilters,
  timezone,
  periodFilters,
}) => {
  const handleFromChange = (from) => {
    if (!from) {
      setFilter("from", from);
      return;
    }

    const calculatedFrom = convertFilterTime(from, timezone);
    setFilter("from", calculatedFrom);
  };

  const handleToChange = (to) => {
    if (!to) {
      setFilter("to", to);
      return;
    }
    const calculatedTo = convertFilterTime(to, timezone);
    setFilter("to", calculatedTo);
    const rawTo = new Date(to);
    rawTo.setHours(0, 0, 0);
    setFilter("rawTo", convertFilterTime(rawTo, timezone));
  };

  const handleResetChanges = () => {
    resetTimelineFilters();
    setTimelineFilter("all");
  };

  return (
    <section className="conciergeBookingsPeriodFilter">
      <DatePicker
        rangeMode
        format={BOOKINGS_DATEPICKER_DATE_FORMAT}
        separator="/"
        separatorPositions={[2, 5]}
        formatRegExp={BOOKINGS_DATEPICKER_DATE_FORMAT_REGEXP}
        parseDateInFormat={parseBookingsDatePickerDate}
        startDateLabel="From"
        endDateLabel="To"
        onStartDateChange={handleFromChange}
        onEndDateChange={handleToChange}
        onResetChanges={handleResetChanges}
        previousDates={periodFilters}
        previousDatesNaming={{
          startDate: "from",
          endDate: "to",
        }}
        timezone={timezone}
      />
    </section>
  );
};

PeriodFilter.propTypes = {
  timezone: string,
  setFilter: func,
  setTimelineFilter: func,
  resetTimelineFilters: func,
  periodFilters: shape({
    from: instanceOf(Date),
    to: instanceOf(Date),
  }),
};

PeriodFilter.defaultProps = {
  setFilter: null,
  setTimelineFilter: null,
  resetTimelineFilters: null,
  periodFilters: null,
  timezone: "",
};

const mapStateToProps = (state) => ({
  periodFilters: bookingsPeriodFiltersSelector(state),
  timezone: settingsTimezoneSelector(state),
});

const actions = {
  setFilter: setPeriodFilter,
  setTimelineFilter,
  resetTimelineFilters,
};

export default connect(mapStateToProps, actions)(PeriodFilter);
