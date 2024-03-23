import {
  formatNumber,
  FullPageLoad,
  generateLinkWithParams,
  GridContainer,
  Link,
  linkPlaceholders,
  PageContainer,
  routing,
  Tab,
  TabContainer,
  Tabs,
  TopBar,
  useAxios,
} from "common";
import { useThemeFlip } from "containers";
import { KPI, useTotalAvailable } from "modules";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DueDates from "./DueDates";
import Transactions from "./Transactions";

const LOAN_ACCOUNT_VIEWS = {
  TRANSACTIONS: "TRANSACTIONS",
  DUE_DATES: "DUE_DATES",
};

const ViewLoanAccount = () => {
  const [view, setView] = useState(LOAN_ACCOUNT_VIEWS.TRANSACTIONS);
  const isTransactions = view === LOAN_ACCOUNT_VIEWS.TRANSACTIONS;
  const { refetchLoanAmounts } = useTotalAvailable();
  const { loanAccountId } = useParams();
  useThemeFlip();
  const { response, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/loanAccounts/${loanAccountId}`,
      params: { populate: "transactions dueDates" },
    },
  });
  const Component = isTransactions ? Transactions : DueDates;
  if (response) {
    const linkParams = { [linkPlaceholders.loanAccountId]: loanAccountId };
    const loanAccount = response.data;
    return (
      <PageContainer style={{ gridTemplateRows: "auto auto auto auto 1fr" }}>
        <TopBar>
          <h1>Loan Account {loanAccount.name}</h1>
          <Link
            to={generateLinkWithParams(routing.loanAccounts.edit, linkParams)}
          >
            Edit
          </Link>
        </TopBar>
        <GridContainer columns={2}>
          <KPI
            kpi={`$${formatNumber(loanAccount.amount)}`}
            description="Amount Drawn"
          />
          <KPI
            kpi={`$${formatNumber(loanAccount.creditLimit)}`}
            description="Credit Limit"
          />
        </GridContainer>
        <TabContainer>
          <Tabs>
            <Tab
              isActive={!isTransactions}
              onClick={() => {
                setView(LOAN_ACCOUNT_VIEWS.TRANSACTIONS);
              }}
            >
              Transactions
            </Tab>
            <Tab
              isActive={isTransactions}
              onClick={() => {
                setView(LOAN_ACCOUNT_VIEWS.DUE_DATES);
              }}
            >
              Due Dates
            </Tab>
          </Tabs>
        </TabContainer>
        <Component
          linkParams={linkParams}
          loanAccount={loanAccount}
          refetch={() => {
            refetch();
            refetchLoanAmounts();
          }}
        />
      </PageContainer>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default ViewLoanAccount;
