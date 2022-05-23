import React from "react";
import {
  objectOf, bool, func, string,
} from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";

import { setTimelineFilter, resetTimelineFilters } from "store/actions/bookings-actions";
import { bookingsTimelineFiltersSelector } from "store/selectors/bookings-selectors";

import "./styles.scss";

const filtersConfig = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Tomorrow",
    value: "tomorrow",
  },
  {
    label: "This week",
    value: "week",
  },
  {
    label: "All",
    value: "all",
  },
];

// eslint-disable-next-line no-shadow
const TimelineFilters = ({
  timelineFilters,
  resetTimelineFilters,
  setTimelineFilter,
}) => {
  const { today, tomorrow, week } = timelineFilters;
  const isItemActive = ({ label, value }) => (
    label === "All"
      ? !today && !week && !tomorrow
      : Boolean(timelineFilters[value])
  );

  return (
    <ul className="conciergeBookingsTimelineFilters">
      {
        filtersConfig.map((filter) => (
          <li
            key={filter.value}
            className={
              cx(
                "conciergeBookingsTimelineFiltersItem",
                {
                  conciergeBookingsTimelineFiltersItemActive: isItemActive(filter),
                },
              )
            }
            onClick={() => {
              resetTimelineFilters();
              if (filter.value) {
                setTimelineFilter(filter.value);
              }
            }}
          >
            {filter.label}
          </li>
        ))
      }
    </ul>
  );
};

TimelineFilters.propTypes = {
  timezone: string,
  timelineFilters: objectOf(bool).isRequired,
  setTimelineFilter: func.isRequired,
  resetTimelineFilters: func.isRequired,
};

TimelineFilters.defaultProps = {
  timezone: null,
};

const mapStateToProps = (state) => ({
  timelineFilters: bookingsTimelineFiltersSelector(state),
});

const actions = {
  setTimelineFilter,
  resetTimelineFilters,
};

export default connect(mapStateToProps, actions)(TimelineFilters);
