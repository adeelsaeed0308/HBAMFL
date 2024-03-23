import {
  formatNumber,
  GridContainer,
  PageContainer,
  routing,
  RowFlex,
  Spinner,
  theme,
  useAxios,
} from "common";
import { useThemeFlip } from "containers";
import { KPI } from "modules";
import React from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Card, Refresh } from "./styles";

const ViewLoan = () => {
  useThemeFlip();
  const { response, loading, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/loanNumbers`,
    },
  });
  const {
    allLoanAccountsTotal,
    moneyAvail,
    inUse,
    todaysPayables,
    todaysReceivables,
    unusedDeposits,
    upcomingPaymentsNext7Days,
  } = response?.data || [];
  return (
    <PageContainer style={{ gridTemplateRows: "auto auto 1fr" }}>
      <RowFlex>
        <h1>Dashboard</h1>
        {loading ? <Spinner /> : <Refresh onClick={refetch} />}
      </RowFlex>
      <GridContainer noBg columns={3}>
        <Card>
          <KPI
            large
            flipped
            kpi={`$${formatNumber(allLoanAccountsTotal)}`}
            description="Total Loans"
          />
        </Card>
        <Card color={theme.colors[moneyAvail >= 0 ? "success" : "danger"]}>
          <KPI
            large
            flipped
            kpi={`$${formatNumber(moneyAvail)}`}
            description="Available Balance"
          />
        </Card>
        <Card>
          <KPI
            large
            flipped
            kpi={`$${formatNumber(inUse)}`}
            description="In Use"
          />
        </Card>
        <Card>
          <KPI
            large
            flipped
            kpi={`$${formatNumber(unusedDeposits)}`}
            description="Unused Deposits"
          />
        </Card>
        <Link to={routing.loanPayments.root} target="_blank">
          <Card>
            <KPI
              large
              flipped
              kpi={`$${formatNumber(upcomingPaymentsNext7Days)}`}
              description={
                <RowFlex center>
                  Upcoming Payments <HiOutlineExternalLink />
                </RowFlex>
              }
            />
          </Card>
        </Link>
        <Link to={routing.loanPayments.root} target="_blank">
          <Card>
            <KPI
              large
              flipped
              kpi={`$${formatNumber(todaysReceivables)}`}
              description={
                <RowFlex center>
                  Today's Receivables <HiOutlineExternalLink />
                </RowFlex>
              }
            />
          </Card>
        </Link>
        <Link to={routing.loans.root} target="_blank">
          <Card>
            <KPI
              large
              flipped
              kpi={`$${formatNumber(todaysPayables)}`}
              description={
                <RowFlex center>
                  Today's Payables <HiOutlineExternalLink />
                </RowFlex>
              }
            />
          </Card>
        </Link>
      </GridContainer>
    </PageContainer>
  );
};

export default ViewLoan;
