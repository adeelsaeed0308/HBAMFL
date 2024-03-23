import { linkPlaceholders, navLinks, routing, TableView, Button } from "common";
import { useThemeFlip } from "containers";
import { LinkToLoan, useTotalAvailable } from "modules";
import React from "react";
import Total from "./Total";
import useExportFile  from "../../../common/hooks/useExportFile"

const PaymentList = () => {
  const { getThisFile } = useExportFile("Loans payments export", "/exportLoanPayments")
  useThemeFlip();
  const { refetchLoanAmounts } = useTotalAvailable();
  const adminProps = {
    deleteUrl: (id) => `/loanPayments/${id}`,
    deleteMessage: () => `Delete Payment`,
    actionLink: routing.loanPayments.add,
    actionName: "Add Payment",
    additionalActions: [
      <Button onClick={() => {
        getThisFile()
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
      name: "amount",
      header: "Amount",
      isCurrency: true,
    },
    {
      name: "paid",
      header: "Paid",
    },
  ];
  return (
    <TableView
      dataGrid
      darker
      url="/loanPayments"
      tableConfig={[
        {
          name: "paymentNumber",
          header: "#",
        },
        ...gridConfig,
      ]}
      gridConfig={gridConfig}
      shapeData={(r) =>
        r.data.data.map((l) => ({
          ...l,
          loan: <LinkToLoan loan={l.loan} />,
          paid: !!l.paid,
        }))
      }
      navLinks={navLinks.loanPayments}
      defaultParams={{ populate: "loan" }}
      linkParam={linkPlaceholders.loanPaymentId}
      header="Payments"
      selectView
      gridHeadingFunction={(item) => item.paymentNumber}
      {...adminProps}
      HeaderComponent={Total}
      onActionComplete={refetchLoanAmounts}
    />
  );
};

export default PaymentList;
