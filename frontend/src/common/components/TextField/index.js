import { ErrorText, RowFlex } from "common/styles";
import { getIn } from "formik";
import React, { useState } from "react";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Container,
  Eye,
  EyeShowing,
  Input,
  Label,
  PasswordInputContainer,
  Suggestions,
} from "./styles";

const TextField = ({
  label,
  required,
  field,
  form,
  type,
  disabled,
  isArea = false,
  onFocus = () => {},
  fillWidth = false,
  allBorders = false,
  prefix,
  onBlur = () => {},
  suggestions = [],
  placeholder,
  value,
  onChange,
  readOnly = false,
}) => {
  const realValue = field?.value || value || "";
  const filteredSuggestions = suggestions?.filter(
    (s) =>
      realValue &&
      s?.toLowerCase().trim().includes(realValue?.toLowerCase().trim())
  );
  const hasSuggestions = suggestions?.length > 0;
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestions = (val) => hasSuggestions && setShowSuggestions(val);

  const realType = type === "password" ? (showPassword ? "text" : type) : type;

  const errorMessage = getIn(form, `errors.${field?.name}`);

  const isTouched = getIn(form, `touched.${field?.name}`);
  const hasError = !!isTouched && !!errorMessage;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      form?.submitForm();
    }
  };

  const EyeToUse = showPassword ? EyeShowing : Eye;
  const inputElement = isArea ? (
    <Quill
      defaultValue={realValue || ""}
      onBlur={onBlur}
      readOnly={readOnly}
      onChange={(v) => {
        const trueValue = v?.replace(/ /, "&nbsp");
        onChange?.(trueValue);
        form?.handleChange({
          target: {
            name: field?.name,
            value: trueValue,
          },
        });
      }}
    />
  ) : type === "password" ? (
    <PasswordInputContainer>
      <Input
        {...field}
        readOnly={readOnly}
        type={realType}
        onFocus={onFocus}
        onKeyDown={handleKeyPress}
        allBorders={allBorders}
        onBlur={onBlur}
      />
      <EyeToUse onClick={() => setShowPassword((prev) => !prev)} />
    </PasswordInputContainer>
  ) : (
    <RowFlex style={{ gap: 0, position: "relative" }}>
      {prefix && <span style={{ fontSize: "0.7rem" }}>{prefix}</span>}
      <Input
        {...field}
        readOnly={readOnly}
        value={realValue}
        type={realType}
        disabled={disabled}
        onFocus={() => {
          onFocus();
          handleSuggestions(true);
        }}
        autoComplete="off"
        onKeyDown={handleKeyPress}
        allBorders={allBorders}
        onBlur={() => {
          onBlur();
          handleSuggestions(false);
        }}
        placeholder={placeholder}
        onChange={(e) => {
          field?.onChange(e);
          onChange?.(e.target.value);
        }}
      />
      {hasSuggestions && showSuggestions && (
        <Suggestions>
          {filteredSuggestions.map((s) => (
            <div
              key={s}
              onMouseDown={() =>
                field?.onChange({ target: { name: field?.name, value: s } })
              }
            >
              {s}
            </div>
          ))}
        </Suggestions>
      )}
    </RowFlex>
  );

  return (
    <Container hasError={hasError} isArea={isArea} fillWidth={fillWidth}>
      {label && (
        <Label hasError={hasError}>
          {label}
          {required ? " *" : ""}
        </Label>
      )}
      {inputElement}
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default TextField;
