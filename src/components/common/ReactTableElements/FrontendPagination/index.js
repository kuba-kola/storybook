import React, { useCallback, useEffect, useState } from "react";
import { number, func } from "prop-types";

import "../Pagination/styles.scss";
import Button from "components/common/Button";

const FrontendPagination = ({
  pages,
  page,
  onPageChange,
}) => {
  const filterPages = (pagesToFilter, totalPages) => {
    const total = totalPages || 1;
    return pagesToFilter.filter((pageToFilter) => pageToFilter <= total);
  };

  const getVisiblePages = (currPage, total) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    }
    if (currPage % 5 >= 0 && currPage > 4 && currPage + 2 < total) {
      return [1, currPage - 1, currPage, currPage + 1, total];
    }
    if (currPage % 5 >= 0 && currPage > 4 && currPage + 2 >= total) {
      return [1, total - 3, total - 2, total - 1, total];
    }
    return [1, 2, 3, 4, 5, total];
  };

  const [visiblePages, setVisiblePages] = useState(getVisiblePages(null, pages));

  useEffect(() => {
    setVisiblePages(getVisiblePages(null, pages));
  }, [pages]);

  const changePage = useCallback((nextPage) => {
    const activePage = page + 1;

    if (nextPage === activePage) {
      return;
    }

    const nextVisiblePages = getVisiblePages(nextPage, pages);
    setVisiblePages(filterPages(nextVisiblePages, pages));

    onPageChange(nextPage - 1);
  });

  useEffect(() => {
    changePage(page + 1);
  }, [page]);

  const activePage = page + 1;

  return (
    <div className="-pagination">
      <section className="conciergeTablePaginationButtonsWrapper">
        <div className="-previous">
          <Button
            onClick={() => {
              if (activePage === 1) return;
              changePage(activePage - 1);
            }}
            disabled={activePage === 1}
            className="conciergeTablePaginationArrowButton"
          >
            <div className="conciergeTablePaginationPrevArrowContent" />
          </Button>
        </div>
        <div className="-center">
          {visiblePages.map((pageNumber, index, array) => (
            <Button
              key={pageNumber}
              className={
                activePage === pageNumber
                  ? "conciergeTablePaginationPageButtonActive"
                  : "conciergeTablePaginationPageButton"
              }
              onClick={() => changePage(pageNumber)}
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
          <Button
            onClick={() => {
              if (activePage === pages) return;
              changePage(activePage + 1);
            }}
            disabled={activePage === pages}
            className="conciergeTablePaginationArrowButton"
          >
            <div className="conciergeTablePaginationNextArrowContent" />
          </Button>
        </div>
      </section>
    </div>
  );
};

FrontendPagination.propTypes = {
  pages: number.isRequired,
  page: number.isRequired,
  onPageChange: func.isRequired,
};

export default FrontendPagination;
