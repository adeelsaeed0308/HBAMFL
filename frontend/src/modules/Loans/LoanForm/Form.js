import {
  Button,
  DatePicker,
  DividerHorizontal,
  formatNumber,
  FormikSubmit,
  ItemSplitter,
  loanPOPrefix,
  RowFlex,
  Spinner,
  TextField,
  useAxios,
  useGoBack,
  useLoanBrands,
  useModalContext,
} from "common";
import { Field, useFormikContext } from "formik";
import React, { useState } from "react";
import AddSOs from "./AddSOs";
import Deposits from "./Deposits";
import { Card, FormContainer } from "./styles";

const Form = ({ isEdit, loading, sos, setSOs }) => {
  const { values, handleChange } = useFormikContext();
  const onComplete = useGoBack();
  const brands = useLoanBrands();
  const { setModalContent, closeModal } = useModalContext();
  const [openDeposits, setOpenDeposits] = useState(false);
  const {
    response,
    loading: depositsLoading,
    callAxios: depositsCall,
  } = useAxios({
    onComplete: (res) => {
      const deposits = res?.data.data.filter((d) => !d.loan);
      handleChange({
        target: {
          name: "deposits",
          value: deposits.map((deposit) => ({
            id: deposit.id,
            amountAppliedToLoan: deposit.depositTotal,
          })),
        },
      });
      deposits.length > 0 && setOpenDeposits(true);
    },
  });

  const deposits = response?.data.data.filter((d) => !d.loan) || [];

  if (values.PO?.substring(0, 3) !== loanPOPrefix) {
    handleChange({
      target: { name: "PO", value: loanPOPrefix + values.PO },
    });
  }

  const allDepositAmounts =
    values.deposits?.reduce((acc, d) => acc + d.amountAppliedToLoan, 0) || 0;
  const suggestedLoanAmount = (values.billTotal || 0) - allDepositAmounts;

  const handleSOs = (ss) => {
    setSOs(ss);
    closeModal();
  };

  return (
    <Card>
      {depositsLoading && <Spinner inline />}
      <FormContainer>
        <div>
          <Field
            name="PO"
            component={TextField}
            label="PO"
            required
            fillWidth
            disabled={openDeposits && deposits.length > 0}
            allBorders
            onBlur={() => {
              depositsCall({
                method: "GET",
                url: "/loanDeposits",
                params: { filters: { PO: values.PO }, limit: 1000 },
              });
            }}
          />
          {openDeposits && deposits.length > 0 && (
            <Deposits deposits={deposits} />
          )}
        </div>
        <Field
          name="date"
          component={DatePicker}
          label="Loan Date"
          required
          type="number"
          fillWidth
          allBorders
        />
        <Field
          name="brand"
          component={TextField}
          label="Brand"
          fillWidth
          allBorders
          suggestions={brands}
        />
        <Field
          name="billTotal"
          component={TextField}
          label="Bill Total"
          fillWidth
          allBorders
          type="number"
        />
        <div>
          <Field
            name="amountDrawn"
            component={TextField}
            label="Amount Drawn"
            required
            fillWidth
            allBorders
            type="number"
          />
          {allDepositAmounts > 0 && (
            <div>
              <div>
                Deposits: <strong>${formatNumber(allDepositAmounts)}</strong>
              </div>
              {values.billTotal > 0 && (
                <div>
                  Suggested Loan Amount:{" "}
                  <strong>${formatNumber(suggestedLoanAmount)}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </FormContainer>
      <DividerHorizontal />
      <RowFlex extend>
        {isEdit ? (
          <div />
        ) : (
          <RowFlex>
            <Button
              style={{ width: "fit-content" }}
              onClick={() => {
                setModalContent(<AddSOs sos={sos} handleSOs={handleSOs} />);
              }}
            >
              Add SOs
            </Button>
            {sos.length > 0 && (
              <p>
                <strong>{sos.length}</strong> SO
                {sos.length === 1 ? "" : "s"} (
                <strong>
                  $
                  {formatNumber(
                    sos.reduce((acc, so) => acc + (so.amount || 0), 0)
                  )}
                </strong>
                )
              </p>
            )}
          </RowFlex>
        )}
        <ItemSplitter autoWidth style={{ justifySelf: "end" }}>
          <Button secondary onClick={onComplete}>
            Cancel
          </Button>
          <FormikSubmit loading={loading}>Save Changes</FormikSubmit>
        </ItemSplitter>
      </RowFlex>
    </Card>
  );
};

export default Form;
