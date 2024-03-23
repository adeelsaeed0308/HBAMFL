import { formatNumber, FormWrapper, ItemSplitter } from "common";
import React from "react";
import { Container } from "./styles";
const Deposits = ({ deposits = [] }) => {
  return (
    <Container>
      <h4>Deposits</h4>
      <FormWrapper>
        {deposits.map((deposit) => {
          return (
            <ItemSplitter key={deposit.depositNumber}>
              <div># {deposit.depositNumber}</div>
              <div>${formatNumber(deposit.depositTotal)}</div>
            </ItemSplitter>
          );
        })}
        <div>Amounts Applied To Loan</div>
      </FormWrapper>
    </Container>
  );
};

export default Deposits;
