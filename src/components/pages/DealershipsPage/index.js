import React, { Component } from "react";
import {
  array, bool, func, string, number, object,
} from "prop-types";
import { history as historyType } from "react-router-prop-types";
import { connect } from "react-redux";
import ReactTable from "react-table-6";

import { getAppointmentFormattedDate, datesSortingMethod } from "shared/utils/datetime";
import {
  dealershipsDataSelector,
  dealershipsLoadingStateSelector,
  dealershipsErrorSelector,
} from "store/selectors/dealerships-selectors";
import { authTokenSelector } from "store/selectors/auth-selectors";
import { currentPageSelector, perPageSelector, sortSelector } from "store/selectors/table-options-selectors";
import { retrieveDealerships } from "store/actions/dealerships-actions";
import PageHeader from "components/common/PageHeader";
import Pagination from "components/common/ReactTableElements/Pagination";
import Panel from "components/common/Panel";

import {
  DEFAULT_SORT_COLUMN_DEALERSHIP, DEFAULT_SORT_DIRECTION, DESC, ASC,
} from "shared/constants";

import AddDealershipModal from "./AddDealershipModal";
import "./styles.scss";

const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortMethod: datesSortingMethod,
  },
];

const DEFAULT_PAGE_SIZE = 10;

const PageTitle = () => <h2>Dealerships</h2>;

class DealershipsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { isModalOpen: false };
  }

  componentDidMount() {
    this.props.fetchDealerships(
      this.props.token,
      {
        page: 1,
        per_page: DEFAULT_PAGE_SIZE,
        sort: `${DEFAULT_SORT_COLUMN_DEALERSHIP} ${DEFAULT_SORT_DIRECTION}`,
      },
    );
  }

  onPageChange = (page) => this.refreshData({ page });

  onPageSizeChange = (perPage) => this.refreshData({ per_page: perPage });

  onSortedChange = (newSorted) => {
    const column = newSorted[0].id;
    const direction = newSorted[0].desc ? DESC : ASC;
    this.refreshData({ sort: `${column} ${direction}` });
  }

  closeModal = () => this.setState({ isModalOpen: false });

  openModal = () => this.setState({ isModalOpen: true });

  refreshData = (params) => {
    const { token, currentPage, perPage } = this.props;
    this.props.fetchDealerships(
      token,
      {
        page: currentPage,
        per_page: perPage,
        ...params,
      },
    );
  }

  prepareData = (data) => data.map((dealership) => {
    const { name, created_at } = dealership;
    const formattedDate = getAppointmentFormattedDate(created_at);
    return { name, created_at: formattedDate };
  })

  render() {
    const {
      dealerships, isLoading, history, perPage, currentPage, sort, error,
    } = this.props;
    const [sortColumn, sortDirection] = sort.split(" ");
    return (
      <section className="conciergeDealershipsPage">
        <PageHeader title={<PageTitle />} />
        <section className="conciergeDealershipsPageMain">
          {error ? (
            <Panel className="conciergeBookingDetailsLoadingPanel">{error}</Panel>
          )
            : (
              <div>
                <section className="conciergeDealershipsPageNavbar">
                  <div>
                    <button
                      type="button"
                      className="conciergeDealershipsPageNavbarAddButton"
                      onClick={this.openModal}
                    >
                      Add new dealership
                    </button>
                  </div>
                </section>
                <ReactTable
                  data={dealerships}
                  minRows={1}
                  resolveData={this.prepareData}
                  loading={isLoading}
                  columns={columns}
                  defaultPageSize={perPage}
                  PaginationComponent={Pagination}
                  onPageChange={this.onPageChange}
                  onPageSizeChange={this.onPageSizeChange}
                  onSortedChange={this.onSortedChange}
                  page={currentPage}
                  manual
                  defaultSorted={[
                    {
                      id: sortColumn,
                      desc: sortDirection === DESC,
                    },
                  ]}
                  getTrProps={(state, rowInfo) => ({
                    onClick: () => {
                      const dealershipId = state.data[rowInfo.index].id;
                      history.push(`/dealerships/${dealershipId}`);
                    },
                    className: "conciergeTableRowLink",
                  })}
                />
              </div>
            )}
        </section>
        {this.state.isModalOpen && (
          <AddDealershipModal onClose={this.closeModal} />
        )}
      </section>
    );
  }
}

DealershipsPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dealerships: array,
  isLoading: bool,
  fetchDealerships: func,
  token: string.isRequired,
  history: historyType,
  currentPage: number,
  perPage: number,
  sort: string,
  // eslint-disable-next-line
  error: object,
};

DealershipsPage.defaultProps = {
  dealerships: [],
  isLoading: false,
  fetchDealerships: null,
  history: null,
  currentPage: 1,
  perPage: DEFAULT_PAGE_SIZE,
  sort: `${DEFAULT_SORT_COLUMN_DEALERSHIP} ${DEFAULT_SORT_DIRECTION}`,
  error: null,
};

const mapStateToProps = (state) => ({
  dealerships: dealershipsDataSelector(state),
  isLoading: dealershipsLoadingStateSelector(state),
  token: authTokenSelector(state),
  currentPage: currentPageSelector(state),
  perPage: perPageSelector(state),
  sort: sortSelector(state),
  error: dealershipsErrorSelector(state),
});

const actions = { fetchDealerships: retrieveDealerships };

export default connect(mapStateToProps, actions)(DealershipsPage);
