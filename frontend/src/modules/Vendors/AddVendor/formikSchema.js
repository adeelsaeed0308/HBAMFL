import { isMissing } from "common";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(isMissing("Name")),
  country: yup.string().required(isMissing("Country")),
  notes: yup.string().nullable(),
  addContact: yup.boolean().required(),
  contactName: yup.string().when("addContact", {
    is: true,
    then: yup.string().required(),
    otherwise: yup.string().nullable(),
  }),
  email: yup.string().when("addContact", {
    is: true,
    then: yup.string().email().required(),
    otherwise: yup.string().nullable(),
  }),
});

const formikSchema = {
  initialValues: {
    name: "",
    country: "",
    notes: "",
    addContact: false,
    contactName: "",
    email: "",
  },
  validationSchema,
};

export default formikSchema;
