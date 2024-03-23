import validationSchema from "../validationSchema";

const formikSchema = (loanAccount) => ({
  initialValues: {
    date: new Date().toISOString(),
    loanAccount,
  },
  validationSchema,
});

export default formikSchema;
