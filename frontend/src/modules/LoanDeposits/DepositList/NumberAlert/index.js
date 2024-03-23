import { formatNumber, Pill, Spinner, useAxios } from "common";
import React, { useEffect } from "react";

const NumberAlert = ({ filters }) => {
  const f = JSON.stringify(filters);
  const { response, callAxios } = useAxios();

  useEffect(() => {
    callAxios({
      method: "GET",
      url: "/loanDeposits",
      params: {
        filters: {
          ...filters,
          loan: { $eq: null },
        },
        limit: 100000,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);
  if (response) {
    const sum = response.data.data.reduce((acc, d) => acc + d.depositTotal, 0);
    return (
      <Pill color={sum === 0 ? "success" : "danger"}>
        ${formatNumber(sum)} Total Unused Deposits
      </Pill>
    );
  }
  return <Spinner inline />;
};

export default NumberAlert;
