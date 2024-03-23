import { linkPlaceholders, navLinks, routing, TableView } from "common";
import { useThemeFlip } from "containers";
import { useTotalAvailable } from "modules/LoanLandingPage";
import React from "react";

const LoanAccountList = () => {
  const { refetchLoanAmounts } = useTotalAvailable();
  useThemeFlip();
  const filterConfig = [
    {
      name: "name",
      type: "input",
      label: "Name",
    },
  ];
  const adminProps = {
    deleteUrl: (id) => `/loanAccounts/${id}`,
    deleteMessage: () => `Delete Loan Account`,
    actionLink: routing.loanAccounts.add,
    actionName: "Add Loan Account",
  };
  const gridConfig = [
    {
      name: "creditLimit",
      header: "Credit Limit",
      isCurrency: true,
    },
    {
      name: "amount",
      header: "Amount",
      isCurrency: true,
    },
    {
      name: "dailyRate",
      header: "Daily Rate",
      isCurrency: true,
    },
  ];
  return (
    <TableView
      darker
      to={routing.loanAccounts.view}
      url="/loanAccounts"
      tableConfig={[
        {
          name: "name",
          header: "Name",
        },
        ...gridConfig,
      ]}
      gridConfig={gridConfig}
      navLinks={navLinks.loanAccounts}
      linkParam={linkPlaceholders.loanAccountId}
      onActionComplete={refetchLoanAmounts}
      header="Loan Accounts"
      filterConfig={filterConfig}
      selectView
      gridHeadingFunction={(item) => item.name}
      {...adminProps}
    />
  );
};

export default LoanAccountList;
