import { ErrorText } from "common/styles";
import React, { useState } from "react";
import { Container, InputContainer, Remove } from "./styles";

const FileUpload = ({ field, form, accept = [".xls", ".xlsx"] }) => {
  const [error, setError] = useState();
  const file = field.value;

  const formError = form.errors[field.name];

  const setFile = (value = null) => {
    form.handleChange({
      target: { name: field.name, value },
    });
  };

  return (
    <Container hasError={!!error}>
      <InputContainer hasFile={!!file}>
        <input
          type="file"
          accept={accept.join(",")}
          onChange={(e) => {
            const uploadedFile = e.target.files[0];
            if (uploadedFile) {
              if (!accept.some((type) => uploadedFile.name.includes(type))) {
                return setError(
                  `Only files of types ${accept.join(",")} Accepted`
                );
              }
              setFile(uploadedFile);
              setError();
            }
            e.target.files = null;
          }}
        />
        {!file ? "Select File" : "File Selected"}
        {file && (
          <Remove
            onClick={() => {
              setFile();
            }}
          />
        )}
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
      {formError && <ErrorText>{formError}</ErrorText>}
    </Container>
  );
};

export default FileUpload;
