import { useAxios } from "common/axios";
import { CollapsibleHeader, FormikSubmit, TextField } from "common/components";
import { Card, Column, FormWrapper } from "common/styles";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

const Notes = ({
  notes = "",
  onComplete = () => {},
  alertSuccess = "",
  url = "",
}) => {
  const [show, setShow] = useState(false);
  const { callAxios, loading } = useAxios({
    alertSuccess,
    onComplete,
  });
  return (
    <div>
      <CollapsibleHeader header="Notes" show={show} setShow={setShow} />
      {show && (
        <Card>
          <Formik
            enableReinitialize
            initialValues={{ notes }}
            onSubmit={(data) => {
              callAxios({
                method: "PUT",
                url,
                data,
              });
            }}
          >
            <FormWrapper>
              <Form>
                <Field
                  name="notes"
                  component={TextField}
                  isArea
                  label="Details"
                />
              </Form>
              <Column>
                <FormikSubmit useDirty loading={loading}>
                  Save
                </FormikSubmit>
              </Column>
            </FormWrapper>
          </Formik>
        </Card>
      )}
    </div>
  );
};

export default Notes;
