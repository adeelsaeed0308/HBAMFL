import * as yup from 'yup';

const formikSchema = {
  initialValues: {
    lineItemsFile: '',
  },
  validationSchema: yup.object({
    lineItemsFile: yup.mixed().required(),
  }),
};

export default formikSchema;
