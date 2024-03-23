import {
  ContactEmailForm,
  contactEmailFormInitialValues,
  contactEmailFormValidationSchema,
  FormikSubmit,
  FormWrapper,
  Spinner,
  useAxios,
  useToast,
} from "common";
import { Form, Formik } from "formik";
import { uniq } from "ramda";
import React, { useState } from "react";
import * as yup from "yup";

const formikSchema = (brandEmails = []) => ({
  initialValues: {
    ...contactEmailFormInitialValues(brandEmails),
    sendEmail: true,
  },
  validationSchema: yup.object(contactEmailFormValidationSchema),
});

const VendorEmailForm = ({ close, ids = [], reloadTable }) => {
  const { alertSuccess, onError } = useToast();
  const [loading, setLoading] = useState(false);
  const { callAxios } = useAxios({
    alertSuccess: "Vendors Emailed",
    onComplete: () => {
      close();
      reloadTable();
    },
  });

  const emailAll = async ({ vendors, payload }) => {
    for (const contacts of Object.values(vendors)) {
      const data = { ...payload, ...contacts };
      await callAxios({
        method: "POST",
        url: "/vendorcontacts/emailreport",
        data,
      });
    }
  };

  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendorRequests",
      params: {
        filters: { _id: { $in: ids } },
        populate: JSON.stringify([
          { path: "vendor", populate: "contacts" },
          { path: "brandRequest" },
        ]),
      },
    },
  });

  if (response) {
    const vendorRequests = response.data.data;
    const brandEmails = uniq(
      vendorRequests.map(
        (v) =>
          v.brandRequest && {
            name: v.brandRequest.brandName,
            email: v.brandRequest.brandEmail,
          }
      )
    ).filter(Boolean);
    const contacts = vendorRequests.reduce(
      (acc, d) => [...acc, ...d.vendor.contacts],
      []
    );
    return (
      <div>
        <h3>Email Vendors</h3>
        <Formik
          {...formikSchema(brandEmails)}
          enableReinitialize
          onSubmit={(payload) => {
            setLoading(true);
            const contactVendors = payload.contactIds
              .map((id) => {
                const contactVendorRequests = vendorRequests.filter((vr) =>
                  vr.vendor.contacts.some((c) => c.id === id)
                );
                return {
                  id,
                  ids: contactVendorRequests.map((vr) => vr.id),
                  vendorId: contactVendorRequests[0].vendor.id,
                };
              })
              .reduce((acc, d) => {
                if (acc[d.vendorId]) {
                  acc[d.vendorId].contactIds.push(d.id);
                } else {
                  acc[d.vendorId] = { contactIds: [d.id], ids: d.ids };
                }
                return acc;
              }, {});
            emailAll({ vendors: contactVendors, payload })
              .then(() => {
                alertSuccess("Vendors Emailed");
                close();
                reloadTable();
              })
              .catch(onError)
              .finally(() => setLoading(false));
          }}
        >
          <FormWrapper>
            <Form>
              <ContactEmailForm contacts={contacts} sendEmail />
            </Form>
            <FormikSubmit loading={loading}>Submit</FormikSubmit>
          </FormWrapper>
        </Formik>
      </div>
    );
  }
  return <Spinner fullPageWidth />;
};

export default VendorEmailForm;
