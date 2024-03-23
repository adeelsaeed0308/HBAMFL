import { ChevronDown, ChevronUp } from "@carbon/icons-react";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import Spinner from "../Spinner";
import { ButtonOptions, ButtonStyle, ExportButtonContainer } from "./styles";

const Button = ({
  children,
  className,
  disabled,
  loading,
  onClick,
  onBlur,
  secondary,
  style,
  type = "button",
  fit,
  danger,
}) => {
  return (
    <ButtonStyle
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      format={secondary ? "secondary" : danger ? "danger" : "standard"}
      style={style}
      type={type}
      onBlur={onBlur}
      fit={fit}
      danger={danger}
    >
      {loading ? <Spinner color="white" inline /> : children}
    </ButtonStyle>
  );
};

const FormikSubmit = ({
  children,
  loading,
  disabled,
  useDirty = false,
  fit,
  danger,
}) => {
  const { submitForm, dirty } = useFormikContext();
  return (
    <Button
      type="button"
      onClick={submitForm}
      disabled={useDirty ? !dirty : disabled}
      loading={loading}
      fit={fit}
      danger={danger}
    >
      {children}
    </Button>
  );
};

const DropdownButton = ({ secondary = false, options = [], children, fit }) => {
  const [showList, setShowList] = useState(false);
  return (
    <Button
      secondary={secondary}
      style={{ position: "relative" }}
      onClick={() => setShowList((prev) => !prev)}
      onBlur={() => setShowList(false)}
      fit={fit}
    >
      <ExportButtonContainer>
        {children}
        {showList ? <ChevronUp /> : <ChevronDown />}
      </ExportButtonContainer>
      {showList && <ButtonOptions>{options}</ButtonOptions>}
    </Button>
  );
};

export { Button, FormikSubmit, DropdownButton };
