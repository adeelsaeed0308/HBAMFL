import {
  brandRequestStatusObject,
  DatePicker,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  getSourcingStatusList,
  useAxios,
  useToast,
} from "common";
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

const StatusChangeForm = ({
  close,
  ids = [],
  reloadTable,
  onActionComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const { alertSuccess, onError } = useToast();

  const { callAxios } = useAxios({});

  const mutate = async (data) => {
    for (const id of ids) {
      await callAxios({
        method: "PUT",
        url: `/brandRequests/${id}/changeStatus`,
        data,
      });
    }
  };

  return (
    <div>
      <h3>Change Status</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          setLoading(true);
          mutate(values)
            .then(() => {
              alertSuccess("Brand Requests Updated Successfully.");
              close();
              reloadTable();
              onActionComplete();
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

export default StatusChangeForm;
