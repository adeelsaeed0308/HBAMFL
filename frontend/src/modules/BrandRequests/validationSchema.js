import * as yup from "yup";

const validationSchema = yup.object({
  brandName: yup.string().required(),
  notes: yup.string().nullable(),
  brandEmail: yup.array().of(yup.string().email("All emails formats should be accurate").nullable()),
  requestBy: yup.string().required(),
  category: yup.string(),
  requestedByCustomer: yup.string(),
  url: yup.string().nullable(),
});

export default validationSchema;
