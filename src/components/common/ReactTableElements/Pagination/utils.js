export const filterPages = (visiblePages, totalPages) => {
  const total = totalPages || 1;
  return visiblePages.filter((page) => page <= total);
};

/* eslint-disable */
export const getVisiblePages = (page, total, pageSize) => {
  const pageCount = getPages(total, pageSize);

  if (pageCount < 7) {
    return filterPages([1, 2, 3, 4, 5, 6], pageCount);
  } else {
    if (page % 5 >= 0 && page > 4 && page + 2 < pageCount) {
      return [1, page - 1, page, page + 1, pageCount];
    } else if (page % 5 >= 0 && page > 4 && page + 2 >= pageCount) {
      return [1, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    } else {
      return [1,2,3,4,5,pageCount];
    }
  }
};

export const getPages = (total, pageSize) => {
  if (pageSize > 0) {
    return Math.ceil(total / pageSize);
  }

  return 1;
}
/* eslint-enable */
