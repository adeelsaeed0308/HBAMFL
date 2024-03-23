import { linkPlaceholders, navLinks, routing, TableView } from "common";
import { UpcomingDueDates } from "modules/LoanAccountDueDates";
import React from "react";

const DueDates = ({ loanAccount, refetch }) => {
  const adminProps = {
    deleteUrl: (id) => `/loanAccountDueDates/${id}`,
    deleteMessage: () => `Delete Due Date`,
    actionLink:
      routing.loanAccountDueDates.add + `?loanAccount=${loanAccount.id}`,
    actionName: "Add Due Date",
  };
  return (
    <TableView
      darker
      onActionComplete={refetch}
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
      defaultParams={{
        populate: "loanAccount",
        filters: { loanAccount: loanAccount.id },
      }}
      navLinks={navLinks.loanAccountDueDates}
      searchParams={`?loanAccount=${loanAccount.id}`}
      linkParam={linkPlaceholders.loanAccountDueDateId}
      header="Loan Account Due Dates"
      selectView
      HeaderComponent={UpcomingDueDates}
      {...adminProps}
    />
  );
};

export default DueDates;
