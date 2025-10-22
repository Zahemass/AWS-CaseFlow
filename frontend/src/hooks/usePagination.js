import { useState, useMemo } from 'react';

const usePagination = (data = [], itemsPerPage = 10) => {
  const [page, setPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  const next = () => setPage((p) => Math.min(p + 1, maxPage));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const jump = (n) => setPage(Math.max(1, Math.min(n, maxPage)));

  return { paginatedData, page, maxPage, next, prev, jump };
};
export default usePagination;
