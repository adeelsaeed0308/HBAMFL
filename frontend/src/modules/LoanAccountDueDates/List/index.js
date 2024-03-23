import {
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
  useLoanAccounts,
} from "common";
import { useThemeFlip } from "containers";
import React from "react";
import UpcomingDueDates from "./UpcomingDueDates";

const LoanAccountDueDateList = () => {
  const loanAccounts = useLoanAccounts();
  useThemeFlip();
  const adminProps = {
    deleteUrl: (id) => `/loanAccountDueDates/${id}`,
    deleteMessage: () => `Delete Due Date`,
    actionLink: routing.loanAccountDueDates.add,
    actionName: "Add Due Date",
  };
  const filterConfig = [
    {
      name: "loanAccount",
      type: "dropdown",
      options: loanAccounts,
      label: "Filter By Account",
    },
  ];
  return (
    <TableView
      darker
      url="/loanAccountDueDates"
      tableConfig={[
        {
          name: "loanAccount",
          header: "Account",
        },
        {
          name: "amount",
          header: "Amount",
          isCurrency: true,
        },
        {
          name: "date",
          header: "Due",
          isDate: true,
        },
      ]}
      shapeData={(r) =>
        r.data.data.map((d) => {
          return { ...d, loanAccount: d.loanAccount?.name };
        })
      }
      defaultParams={{ populate: "loanAccount" }}
      navLinks={navLinks.loanAccountDueDates}
      linkParam={linkPlaceholders.loanAccountDueDateId}
      header="Loan Account Due Dates"
      filterConfig={filterConfig}
      selectView
      HeaderComponent={UpcomingDueDates}
      {...adminProps}
    />
  );
};

export { LoanAccountDueDateList, UpcomingDueDates };
