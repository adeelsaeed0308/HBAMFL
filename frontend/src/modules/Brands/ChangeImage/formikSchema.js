import * as yup from 'yup';

const formikSchema = {
  initialValues: {
    image: '',
  },
  validationSchema: yup.object({
    image: yup.mixed().required(),
  }),
};

export default formikSchema;
