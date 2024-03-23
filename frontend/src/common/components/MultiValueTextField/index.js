import { getIn } from "formik";
import React, { useState } from "react";
import { Container, IconButton, Label } from "./styles";
import { ErrorText, RowFlex } from "common/styles";
import TextField from "../TextField";
import { Button } from "../Buttons";

const MultiValueTextField = (props) => {
  const {
    label,
    required,
    field,
    form,
    disabled,
    onFocus = () => {},
    fillWidth = false,
    allBorders = false,
    prefix,
    onBlur = () => {},
    placeholder,
    value,
    onChange,
    buttonStyle
  } = props;
  const realValue = field?.value || value || [];

  const errorMessage = getIn(form, `errors.${field?.name}`);

  const isTouched = getIn(form, `touched.${field?.name}`);
  const hasError = !!isTouched && !!errorMessage;

  const handleChange = (value, index) => {
    const newValue = [...realValue];
    newValue[index] = value;
    form?.handleChange({
      target: {
        name: field?.name,
        value: newValue,
      },
    });
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleAdd = () => {
    form?.handleChange({
      target: {
        name: field?.name,
        value: [...realValue, ""],
      },
    });
    if (onChange) {
      onChange([...realValue, ""]);
    }
  };

  const handleRemove = (index) => {
    const newValue = [...realValue];
    newValue.splice(index, 1);
    form?.handleChange({
      target: {
        name: field?.name,
        value: [...newValue],
      },
    });
    if (onChange) {
      onChange([...newValue]);
    }
  };

  return (
    <Container hasError={hasError} fillWidth={fillWidth}>
      {label && (
        <Label hasError={hasError}>
          {label}
          {required ? " *" : ""}
        </Label>
      )}

      {realValue.map((value, index) => (
        <RowFlex>
          <TextField
            {...props}
            key={index}
            value={value}
            label={null}
            field={null}
            onChange={(value) => {
              handleChange(value, index);
            }}
          />
          {realValue.length !== 1 && (
            <IconButton
              danger
              onClick={() => {
                handleRemove(index);
              }}
            >
              X
            </IconButton>
          )}
        </RowFlex>
      ))}
      <Button secondary onClick={handleAdd} style={buttonStyle}>Add New Email</Button>

      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default MultiValueTextField;
