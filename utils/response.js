const getPagingData = (data, page, limit) => {
  const totalItems = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  const perPages = limit;
  const next = currentPage == totalPages ? "" : currentPage + 1;
  const previous = currentPage == 1 ? "" : currentPage - 1;

  return { totalItems, totalPages, perPages, currentPage, previous, next };
};

// Format response Payload/Output Data API
export const response = (statusCode, data, msg, res, totalRows) => {
  res.status(statusCode).json({
    status_code: statusCode,
    message: msg,
    totalRows: totalRows,
    payload: data,
  });
};

export const responsePaginate = (statusCode, data, msg, totalRows, limit, page, res
) => {
  res.status(statusCode).json({
    status_code: statusCode,
    message: msg,
    payload: data,
    paging: getPagingData(totalRows, page, limit),
  });
};

export const responseError = (statusCode, msg) => {
  res.status(statusCode).json({
    status_code : statusCode,
    message : msg 
  });
};
  