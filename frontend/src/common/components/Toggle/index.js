import { ErrorText } from "common/styles";
import { getIn } from "formik";
import React from "react";
import { Container, Label, ToggleButton, ToggleContainer } from "./styles";

const Toggle = ({
  label,
  required,
  field,
  form,
  checked: ch,
  onChange,
  fit,
}) => {
  const checked = !!field?.value || !!ch;
  const errorMessage = getIn(form, `errors.${field?.name}`);

  const isTouched = getIn(form, `touched.${field?.name}`);
  const hasError = !!isTouched && !!errorMessage;
  return (
    <Container fit={fit}>
      {label && (
        <Label hasError={hasError} checked={checked}>
          {label}
          {required ? " *" : ""}
        </Label>
      )}
      <ToggleContainer
        isChecked={checked}
        onClick={() => {
          const value = !checked;
          onChange?.(value);
          form?.handleChange({
            target: { name: field.name, value },
          });
        }}
      >
        <ToggleButton isChecked={checked} />
      </ToggleContainer>
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default Toggle;
