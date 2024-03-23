import { formatNumber, Pill, Spinner, useAxios } from "common";
import { addDays, endOfDay } from "date-fns";
import React, { useEffect } from "react";

const Total = ({ filters }) => {
  const f = JSON.stringify(filters);
  const { response, callAxios } = useAxios();

  useEffect(() => {
    callAxios({
      method: "GET",
      url: "/loanPayments",
      params: {
        filters: {
          ...filters,
          paid: { $ne: false },
          date: { $lte: endOfDay(addDays(new Date(), 7)) },
        },
        limit: 100000,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  return response ? (
    <Pill color="success">
      ${formatNumber(response?.data.data.reduce((acc, d) => acc + d.amount, 0))}{" "}
      Paid
    </Pill>
  ) : (
    <Spinner inline />
  );
};

export default Total;
