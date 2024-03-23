import validationSchema from "../validationSchema";

const formikSchema = (currentUser) => ({
  initialValues: {
    brandName: "",
    brandEmail: [""],
    notes: "",
    requestBy: currentUser?.id,
    category: "",
    requestedByCustomer: "",
    url: "",
  },
  validationSchema,
});

export default formikSchema;
