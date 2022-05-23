import React, { Component } from "react";
import {
  arrayOf, bool, func, string, number, object,
} from "prop-types";
import { connect } from "react-redux";
import ReactTable from "react-table-6";
import cx from "classnames";

import { authTokenSelector } from "store/selectors/auth-selectors";
import { dealershipIdSelector } from "store/selectors/app-selectors";
import { currentPageSelector, perPageSelector, sortSelector } from "store/selectors/table-options-selectors";
import {
  menuTemplatesSelector,
  menuTemplatesLoadingStateSelector,
  menuTemplatesErrorSelector,
} from "store/selectors/menu-templates-selectors";
import { menuTemplatePropType } from "shared/prop-types";
import { datesSortingMethod, formatMenuTemplateDate } from "shared/utils/datetime";
import { getMenuTemplates } from "store/actions/menu-templates-actions";
import Panel from "components/common/Panel";
import PageHeader from "components/common/PageHeader";
import Pagination from "components/common/ReactTableElements/Pagination";
import { StatusIconCell, LinkCell } from "components/common/ReactTableElements/cellRenderers";
import ActionsCell from "components/common/ReactTableElements/cellRenderers/ActionsCell";
import searchIcon from "assets/images/search.svg";
import {
  DEFAULT_SORT_COLUMN_DEALERSHIP, DEFAULT_SORT_DIRECTION_MENU_TEMPLATES, DESC, ASC,
} from "shared/constants";

import AddTemplateModal from "./AddTemplateModal";
import "./styles.scss";

const DEFAULT_PAGE_SIZE = 10;

const PageTitle = () => <h2>Menu Templates</h2>;

class MenuTemplatesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      extensions: false,
      isModalOpen: false,
      openedPopupId: null,
    };
  }

  componentDidMount() {
    const { token, dealershipId } = this.props;
    if (dealershipId) {
      this.props.getMenuTemplates(
        dealershipId,
        token,
        {
          page: 1,
          per_page: DEFAULT_PAGE_SIZE,
          sort: `${DEFAULT_SORT_COLUMN_DEALERSHIP} ${DEFAULT_SORT_DIRECTION_MENU_TEMPLATES}`,
        },
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      token, dealershipId, currentPage, perPage,
    } = this.props;
    if (dealershipId !== prevProps.dealershipId) {
      this.props.getMenuTemplates(dealershipId, token, { page: currentPage, per_page: perPage });
    }
    if (this.state.extensions !== prevState.extensions) {
      this.refreshData();
    }
  }

  onPageChange = (page) => this.refreshData({ page });

  onPageSizeChange = (perPage) => this.refreshData({ per_page: perPage });

  onSortedChange = (newSorted) => {
    const column = newSorted[0].id;
    const direction = newSorted[0].desc ? DESC : ASC;
    this.refreshData({ sort: `${column} ${direction}` });
  }

  openModal = () => this.setState({ isModalOpen: true });

  updatePopupId = (popupId) => {
    const currentId = this.state.openedPopupId;
    if (currentId !== popupId) {
      this.setState({ openedPopupId: popupId });
    } else {
      this.clearPopupId();
    }
  };

  clearPopupId = () => this.setState({ openedPopupId: null });

  handleSearchChange = (event) => this.setState({ search: event.target.value });

  searchTemplates = (event) => {
    event.preventDefault();
    this.refreshData();
  }

  closeModal = () => this.setState({ isModalOpen: false });

  refreshData = (params) => {
    const {
      token, dealershipId, currentPage, perPage,
    } = this.props;
    const { search, extensions } = this.state;
    this.props.getMenuTemplates(
      dealershipId,
      token,
      {
        page: currentPage,
        per_page: perPage,
        ...params,
        search,
        extensions,
      },
    );
  }

  selectGeneralTab = () => this.setState({ extensions: false });

  selectExtensionsTab = () => this.setState({ extensions: true });

  prepareData = (data) => data.map((template) => ({
    ...template,
    created_at: formatMenuTemplateDate(template.created_at),
    updated_at: formatMenuTemplateDate(template.updated_at),
    link: {
      href: `/templates/${template.id}`,
      text: template.name,
    },
    actions: {
      id: template.id,
      name: template.name,
      isActive: template.active,
    },
  }));

  render() {
    const {
      menuTemplates, isLoading, perPage, currentPage, sort, error,
    } = this.props;
    const [sortColumn, sortDirection] = sort.split(" ");
    const { search, extensions, isModalOpen } = this.state;
    const columns = [
      {
        Header: "Template Name",
        accessor: "link",
        minWidth: 80,
        Cell: LinkCell,
      },
      {
        Header: "Added On",
        accessor: "created_at",
        sortMethod: datesSortingMethod,
      },
      {
        Header: "Last Edited On",
        accessor: "updated_at",
        sortMethod: datesSortingMethod,
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: StatusIconCell,
      },
      {
        Header: "Manual / Auto",
        Cell: () => "Manual",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: (props) => {
          const updatedProps = {
            ...props,
            openPopup: this.updatePopupId,
            closePopup: this.clearPopupId,
            openedPopupId: this.state.openedPopupId,
          };
          return <ActionsCell {...updatedProps} />;
        },
      },
    ];

    return (
      <section className="conciergeMenuTemplatesPage">
        <PageHeader
          title={<PageTitle />}
          rightSideContent={(
            <form className="conciergeMenuTemplatesSearch" onSubmit={this.searchTemplates}>
              <input
                className="conciergeMenuTemplatesSearchInput"
                placeholder="Search for templates..."
                value={search}
                onChange={this.handleSearchChange}
              />
              <img alt="search" className="conciergeMenuTemplatesSearchIcon" src={searchIcon} />
            </form>
          )}
        />
        <section className="conciergeMenuTemplatesPageMain">
          {error ? (
            <Panel className="conciergeBookingDetailsLoadingPanel">{error.data}</Panel>
          ) : (
            <div>
              <section className="conciergeMenuTemplatesNavbar">
                <div>
                  <button
                    type="button"
                    className={cx("conciergeMenuTemplatesNavbarTab", { active: !extensions })}
                    onClick={this.selectGeneralTab}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={cx("conciergeMenuTemplatesNavbarTab", { active: extensions })}
                    onClick={this.selectExtensionsTab}
                  >
                    Extensions
                  </button>
                </div>
                <button
                  type="button"
                  className="conciergeMenuTemplatesNavbarAddButton"
                  onClick={this.openModal}
                >
                  Add new template
                </button>
              </section>
              <ReactTable
                data={menuTemplates}
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
                minRows={1}
                defaultSorted={[
                  {
                    id: sortColumn,
                    desc: sortDirection === DESC,
                  },
                ]}
                className="conciergeMenuTemplatesTable"
              />
            </div>
          )}
        </section>
        {isModalOpen && (
        <AddTemplateModal isExtension={extensions} onClose={this.closeModal} />
        )}
      </section>
    );
  }
}

MenuTemplatesPage.propTypes = {
  menuTemplates: arrayOf(menuTemplatePropType),
  isLoading: bool,
  getMenuTemplates: func,
  token: string.isRequired,
  dealershipId: string,
  currentPage: number,
  perPage: number,
  sort: string,
  // eslint-disable-next-line
  error: object,
};

MenuTemplatesPage.defaultProps = {
  menuTemplates: [],
  isLoading: false,
  getMenuTemplates: null,
  dealershipId: null,
  currentPage: 1,
  perPage: DEFAULT_PAGE_SIZE,
  sort: `${DEFAULT_SORT_COLUMN_DEALERSHIP} ${DEFAULT_SORT_DIRECTION_MENU_TEMPLATES}`,
  error: null,
};

const mapStateToProps = (state) => ({
  menuTemplates: menuTemplatesSelector(state),
  isLoading: menuTemplatesLoadingStateSelector(state),
  token: authTokenSelector(state),
  dealershipId: dealershipIdSelector(state),
  currentPage: currentPageSelector(state),
  perPage: perPageSelector(state),
  sort: sortSelector(state),
  error: menuTemplatesErrorSelector(state),
});

const actions = {
  getMenuTemplates,
};

export default connect(mapStateToProps, actions)(MenuTemplatesPage);
