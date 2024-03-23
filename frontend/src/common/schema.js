import * as yup from "yup";
import { isMissing } from "./functions";

const stringArraySchema = yup.array().of(yup.string());

const emailToSchema = yup
  .array()
  .of(yup.string().email("Invalid Email").required(isMissing("To")))
  .min(1, isMissing("To"))
  .required();

const emailCcSchema = yup
  .array()
  .of(yup.string().email("Invalid Email"))
  .required();

const emailSchemaObject = {
  to: emailToSchema,
  subject: yup.string().required(isMissing("Subject")),
  html: yup.string().required(isMissing("Body")),
  cc: emailCcSchema,
  bcc: emailCcSchema,
};

export { stringArraySchema, emailToSchema, emailCcSchema, emailSchemaObject };
