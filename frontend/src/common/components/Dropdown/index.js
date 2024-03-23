import { ErrorText, InputLabel, RowFlex } from "common/styles";
import { getIn } from "formik";
import React from "react";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { theme } from "../../context/ThemeProvider";
import Spinner from "../Spinner";
import { Container } from "./styles";

const Dropdown = ({
  label,
  required,
  field,
  form,
  options = [],
  fieldOnly,
  onChange,
  isClearable,
  isMulti,
  isCreatable,
  fillWidth,
  disabled,
  loading,
  placeholder,
  value,
  height,
}) => {
  const realValue = field?.value || value;
  const errorMessage = getIn(form, `errors.${field?.name}`);
  const isTouched = getIn(form, `touched.${field?.name}`);
  const hasError = !!isTouched && !!errorMessage;

  const fontSize = "0.8rem";

  const Component = isCreatable ? Creatable : Select;

  const findValue = (v) => {
    if (!v) {
      return;
    }
    return isMulti
      ? isCreatable
        ? v.map((val) => ({ value: val, label: val }))
        : options.filter((o) => v.includes(o.value))
      : options.find((o) => o.value === v);
  };

  const select = (
    <Container
      style={{ gridTemplateRows: "1fr", height: "100%" }}
      fillWidth={fillWidth}
    >
      <Component
        isDisabled={disabled}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        styles={{
          menu: (p) => ({
            ...p,
            fontSize,
            zIndex: 5,
          }),
          menuList: (p) => ({ ...p, maxHeight: "450px" }),
          placeholder: (p) => ({ ...p, fontSize }),
          input: (p) => ({ ...p, fontSize }),
          singleValue: (p) => ({ ...p, fontSize }),
          control: (p, s) => ({
            ...p,
            boxShadow: "none",
            borderColor: theme.colors.lightGrey,
            ":hover": {
              borderColor: theme.colors[s.isFocused ? "primary" : "lightGrey"],
            },
          }),
        }}
        menuShouldScrollIntoView={false}
        value={findValue(realValue)}
        options={options}
        onChange={(v) => {
          const value = v && (isMulti ? v.map((el) => el.value) : v.value);
          form?.handleChange({
            target: { name: field.name, value },
          });
          onChange?.(value);
        }}
      />
    </Container>
  );
  if (fieldOnly) {
    return select;
  }
  return (
    <Container
      hasError={hasError}
      isMulti={isMulti}
      fillWidth={fillWidth}
      height={height}
    >
      {loading && !label && <Spinner inline />}
      {label && (
        <RowFlex>
          <InputLabel hasError={hasError}>
            {label}
            {required ? " *" : ""}
          </InputLabel>
          {loading && <Spinner inline />}
        </RowFlex>
      )}
      {select}
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};

export default Dropdown;
