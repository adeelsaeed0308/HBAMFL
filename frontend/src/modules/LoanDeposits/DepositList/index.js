import { linkPlaceholders, navLinks, routing, TableView, Button } from "common";
import { useThemeFlip } from "containers";
import { LinkToLoan, useTotalAvailable } from "modules";
import React from "react";
import NumberAlert from "./NumberAlert";
import useExportFile  from "../../../common/hooks/useExportFile"


const DepositList = () => {
  useThemeFlip();
  const { refetchLoanAmounts } = useTotalAvailable();
  const { getThisFile } = useExportFile("Loans deposits export", "/exportLoansDeposits")
  const adminProps = {
    deleteUrl: (id) => `/loanDeposits/${id}`,
    deleteMessage: () => `Delete Deposit`,
    actionLink: routing.loanDeposits.add,
    actionName: "Add Deposit",
    additionalActions: [
      <Button onClick={() => {
        getThisFile();
    }}>
      Export
    </Button>
    ]
  };
  const gridConfig = [
    {
      name: "loan",
      header: "Loan",
    },
    {
      name: "date",
      header: "Date",
      isDate: true,
    },
    {
      name: "SO",
      header: "SO",
      width: 150,
    },
    {
      name: "PO",
      header: "PO",
      width: 150,
    },
    {
      name: "depositTotal",
      header: "Deposit Total",
      isCurrency: true,
      width: 150,
    },
    {
      name: "amountAppliedToLoan",
      header: "Amount Applied To Loan",
      isCurrency: true,
      width: 180,
    },
  ];
  return (
    <>
    <TableView
      darker
      dataGrid
      url="/loanDeposits"
      tableConfig={[
        {
          name: "depositNumber",
          header: "#",
        },
        ...gridConfig,
      ]}
      gridConfig={gridConfig}
      shapeData={(r) =>
        r.data.data.map((l) => ({
          ...l,
          loan: <LinkToLoan loan={l.loan} />,
        }))
      }
      navLinks={navLinks.loanDeposits}
      defaultParams={{ populate: "loan" }}
      linkParam={linkPlaceholders.loanDepositId}
      header="Deposits"
      selectView
      gridHeadingFunction={(item) => item.depositNumber}
      {...adminProps}
      onActionComplete={refetchLoanAmounts}
      HeaderComponent={NumberAlert}
    />
    </>
  );
};

export default DepositList;
