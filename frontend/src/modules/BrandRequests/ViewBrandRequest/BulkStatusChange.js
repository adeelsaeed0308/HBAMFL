import {
  brandRequestStatusObject,
  DatePicker,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  getSourcingStatusList,
  useAxios,
} from "common";
import { useToast } from "common/context/Toast";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    status: "",
    followUpDate: "",
  },
  validationSchema: yup.object({
    status: yup.string().required(),
    followUpDate: yup.string().when("status", {
      is: (status) => status === brandRequestStatusObject.FollowUp.value,
      then: yup.string().required("Follow up date is required field"),
      otherwise: yup.string(),
    }),
  }),
};

const BulkStatusChange = ({
  close,
  ids = [],
  onActionComplete,
  reloadTable,
}) => {
  const [loading, setLoading] = useState(false);
  const { onError, alertSuccess } = useToast();
  const { callAxios } = useAxios();

  const changeStatuses = async (status, followUpDate) => {
    for (const id of ids) {
      await callAxios({
        method: "PUT",
        url: `/vendorRequests/${id}`,
        data: { status, followUpDate },
      });
    }
  };

  return (
    <div>
      <h3>Change Status for {ids.length} Requests</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          setLoading(true);
          changeStatuses(values.status, values.followUpDate)
            .then(() => {
              alertSuccess("Statuses Changed Successfully");
              close();
              onActionComplete();
              reloadTable();
            })
            .catch(onError)
            .finally(() => setLoading(false));
        }}
      >
        {(props) => {
          const { values } = props;
          return (
            <FormWrapper>
              <Form>
                <Field
                  component={Dropdown}
                  options={getSourcingStatusList()}
                  label="Status"
                  required
                  name="status"
                />
                {values?.status === brandRequestStatusObject.FollowUp.value && (
                  <Field
                    component={DatePicker}
                    label="Follow Up Date"
                    required
                    name="followUpDate"
                  />
                )}
              </Form>
              <FormikSubmit loading={loading}>Submit</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};

export default BulkStatusChange;
