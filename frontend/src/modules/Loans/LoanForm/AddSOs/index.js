import {
  Button,
  DeleteIcon,
  FormikSubmit,
  FormWrapper,
  loanSOPrefix,
  RowFlex,
  TextField,
} from "common";
import { Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import formikSchema from "./formikSchema";
import { Container } from "./styles";

const AddSOs = ({ sos = [], handleSOs }) => {
  return (
    <Container>
      <Formik
        {...formikSchema(sos)}
        onSubmit={(v) => {
          handleSOs(v.sos);
        }}
      >
        {({ values, handleChange }) => {
          return (
            <FormWrapper>
              <FieldArray
                name="sos"
                render={(arrayHelpers) => {
                  return (
                    <Form>
                      {values.sos.map((so, idx) => {
                        const name = `sos[${idx}]`;
                        if (so.SO?.substring(0, 3) !== loanSOPrefix) {
                          handleChange({
                            target: {
                              name: `${name}.SO`,
                              value: loanSOPrefix + so.SO,
                            },
                          });
                        }
                        return (
                          <RowFlex key={idx}>
                            <Field
                              name={`${name}.SO`}
                              component={TextField}
                              label="SO"
                              required
                            />
                            <Field
                              name={`${name}.amount`}
                              component={TextField}
                              label="Amount"
                              type="number"
                            />
                            <DeleteIcon
                              onClick={() => arrayHelpers.remove(idx)}
                            />
                          </RowFlex>
                        );
                      })}
                      <Button
                        fit
                        onClick={() => {
                          arrayHelpers.insert(values.sos.length, {
                            SO: loanSOPrefix,
                          });
                        }}
                      >
                        Add SO
                      </Button>
                    </Form>
                  );
                }}
              />
              <FormikSubmit fit>Add SOs</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </Container>
  );
};

export default AddSOs;
