import { Pill } from "common";

class Loan {
  constructor({
    id,
    date,
    PO,
    brand,
    billTotal,
    amountDrawn,
    paidInFull,
    openLoanBalance,
    loanNumber,
    payments = [],
    deposits = [],
  }) {
    this.id = id;
    this.date = date;
    this.PO = PO;
    this.brand = brand;
    this.billTotal = billTotal;
    this.amountDrawn = amountDrawn;
    this.paidInFull = paidInFull;
    this.openLoanBalance = openLoanBalance;
    this.loanNumber = loanNumber;
    this.payments = payments;
    this.deposits = deposits;
  }

  getTotalPaid() {
    const paidFromPayments = this.payments.reduce(
      (acc, payment) => (payment.paid ? payment.amount || 0 : 0) + acc,
      0
    );
    const paidFromDeposits = this.deposits.reduce(
      (acc, deposit) => (deposit.amountAppliedToLoan || 0) + acc,
      0
    );
    return paidFromPayments + paidFromDeposits;
  }

  getAvailable() {
    return this.amountDrawn - this.getTotalPaid();
  }

  getPaymentStatus() {
    const paymentAmount = this.getTotalPaid();
    const status =
      paymentAmount >= this.amountDrawn
        ? "Paid"
        : paymentAmount > 0
        ? "Paid Partially"
        : "Unpaid";
    return {
      status,
      color:
        status === "Paid"
          ? "success"
          : status === "Paid Partially"
          ? "primary"
          : "danger",
    };
  }

  getStatusPill() {
    const { status, color } = this.getPaymentStatus();
    return <Pill color={color}>{status}</Pill>;
  }

  isPaidInFull() {
    return this.getPaymentStatus().status === "Paid";
  }
}

export { Loan };
