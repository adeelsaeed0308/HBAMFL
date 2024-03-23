import { useFilters, usePagination } from "common/components";
import { useEffect } from "react";
import useFirstRender from "./useFirstRender";

const useFiltersAndPagination = ({
  total,
  filterConfig,
  recallFunction = () => {},
  initialLimit = 10,
  initialSkip = 0,
  initialFilters = null
}) => {
  const { paginationComponent, limit, skip, setSkip, setLimit } = usePagination(
    {
      total,
      initialLimit,
      initialSkip,
    }
  );

  const firstRender = useFirstRender();

  const { filters, filtersComponent, setFilters } = useFilters({
    filterConfig,
    recallFunction: () => {
      setSkip(firstRender ? initialSkip : 0);
    },
    initialFilters
  });

  useEffect(() => {
    recallFunction({ limit, skip, filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, skip, filters]);

  return {
    paginationComponent,
    filtersComponent,
    limit,
    skip,
    setSkip,
    setLimit,
    filters,
    setFilters
  };
};

export default useFiltersAndPagination;
