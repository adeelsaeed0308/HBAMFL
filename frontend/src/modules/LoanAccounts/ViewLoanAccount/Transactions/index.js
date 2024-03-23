import {
  generateLinkWithParams,
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
} from "common";
import React from "react";

const Transactions = ({ linkParams, loanAccount, refetch }) => {
  const adminProps = {
    deleteUrl: (id) => `/loanAccountTransactions/${id}`,
    deleteMessage: () => `Delete Transaction`,
    actionLink: generateLinkWithParams(
      routing.loanAccounts.addTransaction,
      linkParams
    ),
    actionName: "Add Transaction",
  };
  return (
    <TableView
      darker
      onActionComplete={refetch}
      url="/loanAccountTransactions"
      tableConfig={[
        {
          name: "date",
          header: "Due",
          isDate: true,
        },
        {
          name: "amount",
          header: "Amount",
          isCurrency: true,
        },
        {
          name: "note",
          header: "Note",
          isHtml: true,
        },
      ]}
      shapeData={(r) =>
        r.data.data.map((d) => {
          return { ...d, loanAccount: d.loanAccount?.name };
        })
      }
      defaultParams={{ filters: { loanAccount: loanAccount.id } }}
      navLinks={navLinks.loanAccountTransactions}
      linkParam={linkPlaceholders.loanAccountTransactionId}
      additionalLinkParams={linkParams}
      header="Transactions"
      selectView
      {...adminProps}
    />
  );
};

export default Transactions;
