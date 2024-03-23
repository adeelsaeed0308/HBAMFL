import { formatNumber, Pill, RowFlex, Spinner, useAxios } from "common";
import React, { createContext, useContext, useEffect } from "react";

const TotalAvailableContext = createContext({ refetchLoanAmounts: () => {} });

const TotalAvailableComponent = ({ response }) => {
  if (response) {
    const {
      data: { moneyAvail, inUse },
    } = response;
    return (
      <RowFlex style={{ justifySelf: "end" }}>
        <Pill small color="primary">
          ${formatNumber(inUse)} In Use
        </Pill>
        <Pill small color={moneyAvail > 0 ? "success" : "danger"}>
          {moneyAvail < 0 ? "-" : ""}${formatNumber(Math.abs(moneyAvail))}{" "}
          Available
        </Pill>
      </RowFlex>
    );
  }
  return (
    <RowFlex style={{ justifySelf: "end" }}>
      <Spinner inline />
    </RowFlex>
  );
};

const TotalAvailableProvider = ({ children }) => {
  const { response, refetch: refetchLoanAmounts } = useAxios({
    callOnLoad: { method: "GET", url: "/loanNumbers" },
  });
  useEffect(() => {
    const interval = setInterval(refetchLoanAmounts, 120000);
    return () => {
      clearInterval(interval);
    };
  }, [refetchLoanAmounts]);

  return (
    <TotalAvailableContext.Provider value={{ refetchLoanAmounts }}>
      <TotalAvailableComponent response={response} />
      {children}
    </TotalAvailableContext.Provider>
  );
};

const useTotalAvailable = () => useContext(TotalAvailableContext);

export { TotalAvailableProvider, useTotalAvailable };
