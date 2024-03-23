import { routing } from "common";
import {
  AddLoan,
  AddLoanAccount,
  AddLoanAccountDueDate,
  AddLoanAccountTranscation,
  AddLoanDeposit,
  AddLoanPayment,
  BulkAddLoan,
  EditLoan,
  EditLoanAccount,
  EditLoanAccountDueDate,
  EditLoanAccountTranscation,
  EditLoanDeposit,
  EditLoanPayment,
  LoanAccountDueDateList,
  LoanAccountList,
  LoanDepositList,
  LoanList,
  LoanPaymentList,
  LoanSummary,
  ViewLoan,
  ViewLoanAccount,
} from "modules";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Container } from "./styles";
import {
  TotalAvailableProvider,
  useTotalAvailable,
} from "./TotalAvailableProvider";

const LoanLandingPage = () => {
  //absolute nested paths are not supported
  //https://github.com/remix-run/react-router/issues/8035
  const transformRoute = (route = "") =>
    route.replace(`${routing.loansRoot}/`, "");

  return (
    <Container>
      <TotalAvailableProvider>
        <Routes>
          <Route
            path={transformRoute(routing.loanDeposits.edit)}
            element={<EditLoanDeposit />}
          />
          <Route
            path={transformRoute(routing.loanDeposits.add)}
            element={<AddLoanDeposit />}
          />
          <Route
            path={transformRoute(routing.loanDeposits.root)}
            element={<LoanDepositList />}
          />
          <Route
            path={transformRoute(routing.loanPayments.edit)}
            element={<EditLoanPayment />}
          />
          <Route
            path={transformRoute(routing.loanPayments.add)}
            element={<AddLoanPayment />}
          />
          <Route
            path={transformRoute(routing.loanPayments.root)}
            element={<LoanPaymentList />}
          />
          <Route
            path={transformRoute(routing.loans.view)}
            element={<ViewLoan />}
          />
          <Route
            path={transformRoute(routing.loans.edit)}
            element={<EditLoan />}
          />
          <Route
            path={transformRoute(routing.loans.bulkAdd)}
            element={<BulkAddLoan />}
          />
          <Route
            path={transformRoute(routing.loans.add)}
            element={<AddLoan />}
          />
          <Route
            path={transformRoute(routing.loans.summary)}
            element={<LoanSummary />}
          />
          <Route
            path={transformRoute(routing.loans.root)}
            element={<LoanList />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.editTransaction)}
            element={<EditLoanAccountTranscation />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.addTransaction)}
            element={<AddLoanAccountTranscation />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.view)}
            element={<ViewLoanAccount />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.edit)}
            element={<EditLoanAccount />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.add)}
            element={<AddLoanAccount />}
          />
          <Route
            path={transformRoute(routing.loanAccounts.root)}
            element={<LoanAccountList />}
          />
          <Route
            path={transformRoute(routing.loanAccountDueDates.edit)}
            element={<EditLoanAccountDueDate />}
          />
          <Route
            path={transformRoute(routing.loanAccountDueDates.add)}
            element={<AddLoanAccountDueDate />}
          />
          <Route
            path={transformRoute(routing.loanAccountDueDates.root)}
            element={<LoanAccountDueDateList />}
          />
        </Routes>
      </TotalAvailableProvider>
      <Outlet />
    </Container>
  );
};

export { LoanLandingPage, useTotalAvailable };
