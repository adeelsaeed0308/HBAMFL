import { Pill, useAxios } from "common";
import { addDays, endOfDay } from "date-fns";
import React, { useEffect } from "react";

const NumberAlert = ({ filters }) => {
  const f = JSON.stringify(filters);
  const { response, callAxios } = useAxios();

  useEffect(() => {
    callAxios({
      method: "GET",
      url: "/loanAccountDueDates",
      params: {
        filters: {
          ...filters,
          date: { $lte: endOfDay(addDays(new Date(), 7)) },
        },
        limit: 100000,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  return <Pill color="primary">{response?.data.data.length} Upcoming</Pill>;
};

export default NumberAlert;
