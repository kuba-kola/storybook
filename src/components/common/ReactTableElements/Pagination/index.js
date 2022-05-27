import React, { Component } from "react";
import {
  number, func, string, bool, object, arrayOf, any,
} from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import Button from "components/common/Button";
import { totalRecordsSelector, perPageSelector } from "store/selectors/table-options-selectors";
import { getVisiblePages, filterPages, getPages } from "./utils";

import "./styles.scss";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visiblePages: getVisiblePages(null, this.props.total, this.props.pageSize),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.paginationOptionsChanged(prevProps)) {
      this.setState({
        visiblePages: getVisiblePages(null, this.props.total, this.props.pageSize),
      });
    }
  }

  getSafePage = (page) => (Number.isNaN(page) ? this.props.page : page);

  paginationOptionsChanged = (prevProps) => (
    this.props.total !== prevProps.total || this.props.pageSize !== prevProps.pageSize
  );

  changePage = (page) => {
    const safePage = this.getSafePage(page);
    const visiblePages = getVisiblePages(safePage, this.props.total, this.props.pageSize);
    const pages = getPages(this.props.total, this.props.pageSize);

    this.setState({
      visiblePages: filterPages(visiblePages, pages),
    });

    if (this.props.page !== safePage) {
      this.props.onPageChange(safePage);
    }
  }

  canNext = () => {
    const pages = getPages(this.props.total, this.props.pageSize);
    const currentPage = this.props.page + 1;
    return currentPage <= pages;
  }

  canPrevious = () => this.props.page !== 1

  render() {
    const {
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      onPageSizeChange,
      className,
      style,
      PreviousComponent,
      NextComponent,
      rowsSelectorText,
    } = this.props;
    const { visiblePages } = this.state;

    return (
      <div className={classnames(className, "-pagination")} style={style}>
        <section className="conciergeTablePaginationButtonsWrapper">
          <div className="-previous">
            <PreviousComponent
              variant="neutral"
              icon="leftArrow"
              padding="small"
              onClick={() => {
                if (!this.canPrevious()) {
                  return;
                }
                this.changePage(page - 1);
              }}
              disabled={!this.canPrevious()}
            />
          </div>
          <div className="-center">
            {visiblePages.map((pageNumber, index, array) => (
              <Button
                key={pageNumber}
                className={
                  page === pageNumber
                    ? "conciergeTablePaginationPageButtonActive"
                    : "conciergeTablePaginationPageButton"
                }
                padding="small"
                onClick={() => this.changePage(pageNumber)}
              >
                {
                  array[index - 1] + 2 < pageNumber
                    ? (
                      <>
                        <span className="conciergeTablePaginationPageButtonDots">...</span>
                        {pageNumber}
                      </>
                    )
                    : pageNumber
                }
              </Button>
            ))}
          </div>
          <div className="-next">
            <NextComponent
              onClick={() => {
                if (!this.canNext()) {
                  return;
                }
                this.changePage(page + 1);
              }}
              disabled={!this.canNext()}
              variant="neutral"
              icon="rightArrow"
              padding="small"
            />
          </div>
        </section>
        {showPageSizeOptions && (
          <span className="select-wrap -pageSizeOptions">
            <span>Show records: </span>
            <select
              className="conciergeTablePaginationPageSizeSelect"
              aria-label={rowsSelectorText}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              value={pageSize}
            >
              {pageSizeOptions.map((option, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <option key={i} value={option}>
                  {`${option}`}
                </option>
              ))}
            </select>
          </span>
        )}
      </div>
    );
  }
}

Pagination.propTypes = {
  page: number.isRequired,
  onPageChange: func.isRequired,
  showPageSizeOptions: bool,
  pageSizeOptions: arrayOf(number).isRequired,
  pageSize: number,
  onPageSizeChange: func,
  className: string,
  /* eslint-disable react/forbid-prop-types */
  style: object,
  PreviousComponent: any,
  NextComponent: any,
  /* eslint-enable */
  rowsSelectorText: string,
  total: number,
};

Pagination.defaultProps = {
  showPageSizeOptions: true,
  pageSize: 0,
  onPageSizeChange: null,
  className: null,
  style: null,
  PreviousComponent: Button,
  NextComponent: Button,
  rowsSelectorText: null,
  total: 0,
};

const mapStateToProps = (state) => ({
  pageSize: perPageSelector(state),
  total: totalRecordsSelector(state),
});

export default connect(mapStateToProps)(Pagination);
