import { ErrorText, InputLabel } from "common/styles";
import { getIn } from "formik";
import React, { forwardRef } from "react";
import DateSelect from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { CalendarIcon, Container, Input } from "./styles";

const DateInput = forwardRef(
  ({ value, onClick, allBorders, disabled }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      allBorders={allBorders} 
      disabled={disabled}
    >
      {value ? new Date(value).toLocaleDateString() : "Enter a Date..."}
      <CalendarIcon />
    </Input>
  )
);

const DatePicker = ({
  label,
  required,
  field,
  form,
  disabled,
  fillWidth = false,
  allBorders = false,
  value,
  onChange,
}) => {
  const realValue = value || field?.value;
  const errorMessage = getIn(form, `errors.${field?.name}`);

  const isTouched = getIn(form, `touched.${field?.name}`);
  const hasError = !!isTouched && !!errorMessage;

  return (
    <Container hasError={hasError} fillWidth={fillWidth}>
      {label && (
        <InputLabel hasError={hasError}>
          {label}
          {required ? " *" : ""}
        </InputLabel>
      )}
      <DateSelect
        selected={realValue && new Date(realValue)}
        disabled={disabled}
        customInput={<DateInput allBorders={allBorders} disabled={disabled} />}
        onChange={(e) => {
          field?.onChange({ target: { name: field?.name, value: e } });
          onChange?.(e);
        }}
      />
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default DatePicker;
