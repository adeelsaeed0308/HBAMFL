import {
  brandRequestStatusObject,
  DatePicker,
  FormikSubmit,
  FormWrapper,
  useAxios,
} from "common";
import { useToast } from "common/context/Toast";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";

const UpdateFollowUpDate = ({
  id,
  close,
  refetch,
  reloadTable,
  row: { followUpDate },
}) => {
  const [loading, setLoading] = useState(false);
  const { onError, alertSuccess } = useToast();
  const { callAxios } = useAxios();

  const formikSchema = {
    initialValues: {
      followUpDate: followUpDate || "",
    },
    validationSchema: yup.object({
      followUpDate: yup.string().required(),
    }),
  };

  const changeStatusToFollowUp = async (followUpDate) => {
    await callAxios({
      method: "PUT",
      url: `/brandRequests/${id}/changeStatus`,
      data: { status: brandRequestStatusObject.FollowUp.value, followUpDate },
    });
  };

  return (
    <div>
      <h3>Change Status To Follow Up</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          setLoading(true);
          changeStatusToFollowUp(values.followUpDate)
            .then(() => {
              alertSuccess("Statuses Changed Successfully");
              close();
              refetch();
              reloadTable();
            })
            .catch(onError)
            .finally(() => setLoading(false));
        }}
      >
        {(props) => {
          return (
            <FormWrapper>
              <Form>
                <Field
                  component={DatePicker}
                  label="Follow Up Date"
                  required
                  name="followUpDate"
                  value={followUpDate}
                />
              </Form>
              <FormikSubmit loading={loading}>Submit</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateFollowUpDate;
