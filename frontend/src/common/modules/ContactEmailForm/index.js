import { Dropdown, TextField, Toggle } from "common/components";
import {
  getContactLabel,
  isMissing,
  sortAndFormatOptions,
} from "common/functions";
import { stringArraySchema } from "common/schema";
import { Field, useFormikContext } from "formik";
import React, { Fragment } from "react";
import * as yup from "yup";

const emailWhen = {
  is: true,
  then: yup.string().required(isMissing("Field")),
  otherwise: yup.string().nullable(),
};

const contactEmailFormInitialValues = (
  brandEmails = [],
  sendEmail = false
) => ({
  sendEmail,
  contactIds: [],
  title: "Brand to Open",
  body: `<p>See attached brands to open. Please reply once requested. Thank you</p>${
    brandEmails.length > 0 ? "<h3>Emails</h3>" : ""
  }${brandEmails
    .map(({ name, email }) => `<p>${name} - ${email}</p>`)
    .join("")}`,
});

const contactEmailFormValidationSchema = {
  contactIds: stringArraySchema
    .when("sendEmail", {
      is: true,
      then: stringArraySchema
        .min(1, "Please Select at least 1 contact")
        .required(),
      otherwise: stringArraySchema.required(),
    })
    .required(),
  title: yup.string().when("sendEmail", emailWhen),
  body: yup.string().when("sendEmail", emailWhen),
};

const ContactEmailForm = ({ contacts = [], sendEmail = false }) => {
  const { values } = useFormikContext();
  return contacts.length === 0 ? (
    <div>No contacts available to email</div>
  ) : (
    <Fragment>
      {!sendEmail && (
        <Field name="sendEmail" component={Toggle} label="Send Email?" />
      )}
      {values.sendEmail && (
        <Fragment>
          <Field
            name="contactIds"
            component={Dropdown}
            label="Contacts"
            isMulti
            required
            options={sortAndFormatOptions({
              list: contacts,
              labelKey: (c) => getContactLabel(c),
            })}
          />
          <Field name="title" component={TextField} label="Title" required />
          <Field
            name="body"
            component={TextField}
            label="Body"
            required
            isArea
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export {
  contactEmailFormInitialValues,
  contactEmailFormValidationSchema,
  ContactEmailForm,
};
