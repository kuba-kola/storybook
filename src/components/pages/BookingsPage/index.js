import React, { useState, useEffect, useRef } from "react";
import {
  number,
  array,
  bool,
  func,
  string,
  objectOf,
  any,
} from "prop-types";
import { history as historyType } from "react-router-prop-types";
import { connect } from "react-redux";
import ReactTable from "react-table-6";
import { identity } from "ramda";
import { isToday, format } from "date-fns";
import { convertToTimeZone } from "date-fns-timezone";
import {
  ADVISOR_ROLE,
  BDC_ROLE,
  BOOKING_SOURCE,
  IMPORT_SOURCE,
  SCHEDULER_SOURCE,
  DESC,
  ASC,
} from "shared/constants";
import {
  getAppointmentFormattedDateTimeFirst,
  datesSortingMethod,
  convertTime12to24,
  bulkTimeCompare,
} from "shared/utils/datetime";
import {
  bookingsDataSelector,
  bookingsLoadingStateSelector,
  bookingsTimelineFiltersSelector,
  bookingsSearchStringSelector,
  bookingsErrorSelector,
  bookingsSearchParams,
} from "store/selectors/bookings-selectors";
import { authTokenSelector } from "store/selectors/auth-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { settingsTimezoneSelector } from "store/selectors/settings-selectors";
import {
  currentPageSelector,
  perPageSelector,
  sortSelector,
} from "store/selectors/table-options-selectors";
import { retrieveBookings, setSearchString } from "store/actions/bookings-actions";
import Panel from "components/common/Panel";
import PageHeader from "components/common/PageHeader";
import SearchField from "components/common/SearchField";
import Pagination from "components/common/ReactTableElements/Pagination";
import {
  CustomerCell,
  RepairOrderCell,
  MadeByCell,
  AppArrivedTimeCell,
} from "components/common/ReactTableElements/cellRenderers";
import BookingAdditionalInfoCell from "components/common/ReactTableElements/cellRenderers/BookingAdditionalInfoCell";
import { useDeepCompareEffect, useDebounce } from "shared/hooks";
import TimelineFilters from "./TimelineFilters";
import PeriodFilter from "./PeriodFilter";
import AdditionalInfoFilter from "./AdditionalInfoFilter";
import CapacityDashboard from "./CapacityDashboard";
import "react-table-6/react-table.css";
import "./styles.scss";

const columns = [
  {
    Header: "App time / Arrived",
    accessor: "appointment_datetime",
    sortMethod: datesSortingMethod,
    width: 225,
    Cell: (booking) => (
      <AppArrivedTimeCell
        appTime={booking.original.appointment_datetime}
        arrivedTime={booking.original.arrived_at}
        hasWarning={booking.original.hasMissingInfo}
        isLate={booking.original.isLate}
      />
    ),
  },
  {
    Header: "Customer",
    accessor: "customer_full_name",
    sort_column: "customer_first_name",
    width: 225,
    Cell: (booking) => (
      <CustomerCell
        customer={booking.original.customer_full_name}
        vehicle={
          booking.original.vehicle_set || {
            make: null,
            model: null,
            model_year: null,
          }
        }
        vehicleImgUrl={
          booking.original.vehicle ? booking.original.vehicle.image.url : null
        }
      />
    ),
  },
  {
    Header: "RO",
    accessor: "repair_order_number",
    width: 125,
    Cell: (booking) => (
      <RepairOrderCell
        repair_order_number={booking.original.repair_order_number}
        repair_order_tag={booking.original.repair_order_tag}
      />
    ),
  },
  {
    Header: "Advisor",
    accessor: "service_advisor_name",
    width: 165,
  },
  {
    Header: "Made by",
    accessor: "created_by_name",
    sort_column: "created_by_name",
    width: 165,
    Cell: (booking) => (
      <MadeByCell
        source={booking.original.booking_source}
        made_by_name={booking.original.made_by_name}
        made_by_role={booking.original.made_by_role}
      />
    ),
  },
  {
    Header: "Additional Info",
    sortable: false,
    width: 215,
    Cell: (booking) => (
      <BookingAdditionalInfoCell
        jobState={booking.original.job_status}
        status={booking.original.status}
        customerWaiting={booking.original.client_waiting}
        withConcern={booking.original.with_concern}
        withRecall={booking.original.with_recall}
        appraisalRequested={booking.original.appraisal_requested}
        alternativeTransport={booking.original.transport}
      />
    ),
  },
];

const PageTitle = () => <h2>Bookings</h2>;

const BookingsPage = ({
  token,
  dealershipId,
  timelineFilters,
  fetchBookings,
  sort,
  perPage,
  currentPage,
  free_text_search,
  searchParams,
  error,
  bookings,
  isLoading,
  history,
  changeSearchString,
  timezone,
}) => {
  const [searchPhrase, setSearchPhrase] = useState(free_text_search);
  const [newPage, setNewPage] = useState(currentPage);
  const [newPerPage, setNewPerPage] = useState(perPage);
  const [newSort, setNewSort] = useState(sort);

  const isFirstRun = useRef(true);
  const delay = searchPhrase === "" ? 0 : 500;
  const debouncedSearchPhrase = useDebounce(searchPhrase, delay);

  useDeepCompareEffect(() => {
    if (
      (
        isFirstRun.current
        && searchParams["q[appointment_datetime_gteq]"]
        && searchParams["q[appointment_datetime_lteq]"]
      ) || !isFirstRun.current
    ) {
      isFirstRun.current = false;

      if (newPage === 1) {
        fetchBookings(
          dealershipId,
          {
            per_page: newPerPage,
            ...searchParams,
          },
          token,
        );
      } else {
        setNewPage(1);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isFirstRun.current) {
      fetchBookings(
        dealershipId,
        {
          per_page: newPerPage,
          page: newPage,
          sort: newSort,
          ...searchParams,
        },
        token,
      );
    }
  }, [newPage, newPerPage, newSort]);

  useEffect(() => {
    changeSearchString(debouncedSearchPhrase);
  }, [debouncedSearchPhrase]);

  const onSortedChange = (newSorted, column) => {
    const sortColumn = column.sort_column ? column.sort_column : column.id;
    const direction = newSorted[0].desc ? DESC : ASC;
    setNewSort(`${sortColumn} ${direction}`);
  };

  const prepareSortOptions = (sortOptions) => {
    const [apiSortColumn, sortDirection] = sortOptions.split(" ");
    const sortColumn = columns.find((col) => {
      if (col.sort_column) {
        return col.sort_column === apiSortColumn;
      }
      return col.accessor === apiSortColumn;
    });
    const sortColumnId = sortColumn ? sortColumn.accessor : "";
    return [sortColumnId, sortDirection];
  };

  const prepareData = (data) => data
    .filter((booking) => {
      if (booking.formatted) {
        return true;
      }

      if (timelineFilters.today
        && !isToday(
          booking.appointment_datetime
          || (
            booking.arrived_at && !isToday(booking.arrived_at)
          ),
        )
      ) {
        return false;
      }
      return true;
    })
    .map((booking) => {
      if (booking.formatted) {
        return booking;
      }

      const {
        vehicle_set,
        appointment_datetime,
        customer,
        phone_number,
        service_advisor,
        arrived_at,
        vehicle,
      } = booking;

      const customer_first_name = customer ? customer.first_name : null;
      const customer_last_name = customer ? customer.last_name : null;
      const customer_phone_number = customer ? customer.phone_number : null;
      const customer_address = customer ? customer.address : null;
      const customer_email = customer ? customer.email : null;
      const make = vehicle_set ? vehicle_set.make : null;
      const model = vehicle_set ? vehicle_set.model : null;
      const model_year = vehicle_set ? vehicle_set.model_year : null;
      const mileage = vehicle ? vehicle.mileage : null;
      const vin = vehicle ? vehicle.vin : null;

      const carTitle = vehicle_set && make && model && model_year
        ? `${make} ${model} ${model_year}`.toLowerCase()
        : "-";
      const formattedDate = getAppointmentFormattedDateTimeFirst(appointment_datetime);
      const customerFullNameLower = () => {
        if (customer_first_name && customer_last_name) {
          return `${customer_first_name} ${customer_last_name}`.toLowerCase();
        }
        return "-";
      };
      const customerPhoneNumber = () => {
        if (phone_number && phone_number.length > 5) {
          return phone_number;
        }

        if (customer_phone_number && customer_phone_number.length > 5) {
          return customer_phone_number;
        }

        return "-";
      };
      const repairOrderNumber = () => {
        if (booking.kind === "Appointment") {
          return booking.repair_order_number;
        }

        if (booking.kind === "RepairOrder") {
          return booking.external_number;
        }

        return "-";
      };
      const serviceAdvisorName = () => {
        if (service_advisor) {
          return service_advisor.name;
        }
        return "-";
      };
      const source = () => {
        switch (booking.created_by.source) {
          case IMPORT_SOURCE:
            return "Imported";
          case BOOKING_SOURCE:
            return "Customer";
          default:
            return null;
        }
      };

      const madeBy = () => {
        switch (booking.created_by.source) {
          case SCHEDULER_SOURCE:
            if (
              booking.created_by.created_by_role === BDC_ROLE
              || booking.created_by.created_by_role === ADVISOR_ROLE
            ) {
              return booking.created_by.created_by_name;
            }

            return null;
          default:
            return null;
        }
      };

      const role = () => {
        if (booking.created_by.created_by_role === BDC_ROLE) {
          return "BDC";
        }
        return null;
      };

      const arrivedAt = () => {
        if (arrived_at) {
          return getAppointmentFormattedDateTimeFirst(arrived_at);
        }
        return "-";
      };

      const hasMissingInfo = () => {
        const valid = vin
          && mileage
          && make
          && model
          && model_year
          && customer_address
          && customer_first_name
          && customer_last_name
          && customer_phone_number
          && customer_email;

        return !valid;
      };

      const isLate = () => {
        if (timelineFilters.today && formattedDate && timezone) {
          const timezoneTime = convertToTimeZone(new Date(), { timeZone: timezone });
          const timeLeftStr = format(timezoneTime, "HH:mm");
          const timeRightStr = convertTime12to24(formattedDate);
          const diff = bulkTimeCompare(timeLeftStr, timeRightStr);

          return timelineFilters.today && repairOrderNumber() === "-" && diff >= 1;
        }

        return false;
      };

      const preparedBooking = booking;
      preparedBooking.car_title = carTitle;
      preparedBooking.repair_order_number = repairOrderNumber();
      preparedBooking.customer_full_name = customerFullNameLower();
      preparedBooking.appointment_datetime = formattedDate;
      preparedBooking.phone_number = customerPhoneNumber();
      preparedBooking.service_advisor_name = serviceAdvisorName();
      preparedBooking.arrived_at = arrivedAt();
      preparedBooking.datetime = appointment_datetime;
      preparedBooking.isLate = isLate();
      preparedBooking.hasMissingInfo = hasMissingInfo();
      preparedBooking.formatted = true;
      preparedBooking.made_by_name = madeBy();
      preparedBooking.made_by_role = role();
      preparedBooking.booking_source = source();
      return preparedBooking;
    });

  const [sortColumn, sortDirection] = prepareSortOptions(sort);

  const onPageSizeChange = (size) => {
    setNewPerPage(size);
    setNewPage(1);
  };

  return (
    <section className="conciergeBookingPage">
      <PageHeader
        title={<PageTitle />}
        rightSideContent={(
          <div className="conciergeBookingPageRightSideContent">
            <AdditionalInfoFilter />
            <SearchField
              placeholder="Search for bookings..."
              value={searchPhrase}
              tooltipContent="Please press Enter to perform search"
              onChange={setSearchPhrase}
              onEnter={identity}
            />
          </div>
        )}
      />
      <section className="conciergeBookingPageMain">
        {error ? (
          <Panel className="conciergeBookingDetailsLoadingPanel">
            {error || error.error}
          </Panel>
        ) : (
          <div>
            <section className="conciergeBookingPageFilters">
              <TimelineFilters />
              <div className="row">
                {timelineFilters.all ? <PeriodFilter /> : null}
              </div>
            </section>
            <CapacityDashboard />
            <ReactTable
              data={bookings}
              minRows={1}
              resolveData={prepareData}
              loading={isLoading}
              columns={columns}
              defaultPageSize={perPage}
              PaginationComponent={Pagination}
              onPageChange={setNewPage}
              onPageSizeChange={onPageSizeChange}
              onSortedChange={onSortedChange}
              page={newPage}
              noDataText="No appointments found"
              className="booking"
              manual
              defaultSorted={[
                {
                  id: sortColumn,
                  desc: sortDirection === DESC,
                },
              ]}
              getTrProps={(state, rowInfo) => ({
                onClick: () => {
                  history.push(
                    `/bookings/${rowInfo.original.guid}/${rowInfo.original.kind}?dealershipId=${dealershipId}`,
                  );
                },
                className: `conciergeTableRowLink
                  ${rowInfo && rowInfo.original.status === "arrived"
                  ? "conciergeTableRowLinkGreen"
                  : ""
                  }
                  ${rowInfo && rowInfo.original.status === "checked_in"
                    ? "conciergeTableRowLinkBlue"
                    : ""
                  }
                  ${rowInfo && rowInfo.original.status === "not_checked_in" && rowInfo.original.aasm_state === "arrived"
                    ? "conciergeTableRowLinkYellow"
                    : ""}
                `,
              })}
              prepareRow
              resizable={false}
            />
          </div>
        )}
      </section>
    </section>
  );
};

BookingsPage.propTypes = {
  history: historyType,
  // eslint-disable-next-line react/forbid-prop-types
  bookings: array.isRequired,
  isLoading: bool.isRequired,
  timelineFilters: objectOf(bool).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  searchParams: objectOf(any).isRequired,
  free_text_search: string.isRequired,
  token: string.isRequired,
  dealershipId: number.isRequired,
  currentPage: number.isRequired,
  perPage: number.isRequired,
  sort: string.isRequired,
  error: string,
  timezone: string,
  fetchBookings: func.isRequired,
  changeSearchString: func.isRequired,
};

BookingsPage.defaultProps = {
  history: null,
  error: null,
  timezone: null,
};

const mapStateToProps = (state) => ({
  bookings: bookingsDataSelector(state),
  isLoading: bookingsLoadingStateSelector(state),
  timelineFilters: bookingsTimelineFiltersSelector(state),
  searchParams: bookingsSearchParams(state),
  free_text_search: bookingsSearchStringSelector(state),
  token: authTokenSelector(state),
  dealershipId: dealershipIdSelector(state),
  currentPage: currentPageSelector(state),
  perPage: perPageSelector(state),
  sort: sortSelector(state),
  error: bookingsErrorSelector(state),
  timezone: settingsTimezoneSelector(state),
});

const actions = {
  fetchBookings: retrieveBookings,
  changeSearchString: setSearchString,
};

export default connect(mapStateToProps, actions)(BookingsPage);
