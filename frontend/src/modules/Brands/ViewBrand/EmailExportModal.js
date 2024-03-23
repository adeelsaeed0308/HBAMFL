import {
  Dropdown,
  FormikSubmit,
  FormWrapper,
  TextField,
  Toggle,
  useAxios,
  useCurrencies,
  usePrevEmails,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import { formikSchemaForEmail } from "./formikSchema";
import { EmailModalContainer } from "./styles";

const EmailExportModal = ({ brand }) => {
  const { currencyOptions } = useCurrencies();

  const { callAxios: sendEmail, loading } = useAxios({
    alertSuccess: "Email Successfully Sent!",
  });

  const prevEmailsOptions = usePrevEmails();

  return (
    <EmailModalContainer>
      <Formik
        {...formikSchemaForEmail(brand)}
        onSubmit={(data) => {
          sendEmail({
            method: "POST",
            url: `/brands/${brand.id}/email`,
            data: {
              to: data.to.join(","),
              cc: data.cc?.join(","),
              bcc: data.bcc?.join(","),
              subject: data.subject,
              html: data.html,
            },
            params: {
              margin: data.margin,
              MSRPDiscount: data.MSRPDiscount,
              isRaw: data.isRaw,
              toCurrency: data.toCurrency,
            },
          });
        }}
      >
        {({ handleChange, values }) => {
          return (
            <FormWrapper>
              <Form>
                <Field
                  name="margin"
                  label={`Profit Margin %${
                    !brand.itemsHaveCostPrice
                      ? " (Items do not have Cost Price)"
                      : ""
                  }`}
                  disabled={!brand.itemsHaveCostPrice || values.isRaw}
                  component={TextField}
                  type="number"
                  fillWidth
                  onFocus={() => {
                    handleChange({
                      target: {
                        name: "MSRPDiscount",
                        value: undefined,
                      },
                    });
                  }}
                />
                <Field
                  name="MSRPDiscount"
                  fillWidth
                  label={`Discount %${
                    !brand.itemsHaveMSRP ? " (Items do not have MSRP)" : ""
                  }`}
                  disabled={!brand.itemsHaveMSRP || values.isRaw}
                  component={TextField}
                  type="number"
                  onFocus={() => {
                    handleChange({
                      target: { name: "margin", value: undefined },
                    });
                  }}
                />
                <Field name="isRaw" component={Toggle} label="Apply Nothing" />
                <Field
                  name="fromCurrency"
                  label="From Currency"
                  component={Dropdown}
                  options={currencyOptions}
                  disabled
                />
                <Field
                  name="toCurrency"
                  label="To Currency"
                  component={Dropdown}
                  options={currencyOptions}
                />
                <Field
                  name="to"
                  component={Dropdown}
                  label="To"
                  options={prevEmailsOptions}
                  isClearable
                  isMulti
                  isCreatable
                  fillWidth
                />
                <Field
                  name="cc"
                  component={Dropdown}
                  label="CC"
                  options={prevEmailsOptions}
                  isClearable
                  isMulti
                  isCreatable
                  fillWidth
                />
                <Field
                  name="bcc"
                  component={Dropdown}
                  label="BCC"
                  options={prevEmailsOptions}
                  isClearable
                  isMulti
                  isCreatable
                  fillWidth
                />
                <Field
                  name="subject"
                  component={TextField}
                  label="Subject"
                  required
                  fillWidth
                />
                <Field
                  name="html"
                  component={TextField}
                  label="Body"
                  required
                  isArea
                />
              </Form>
              <FormikSubmit loading={loading}>Send</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </EmailModalContainer>
  );
};

export default EmailExportModal;
