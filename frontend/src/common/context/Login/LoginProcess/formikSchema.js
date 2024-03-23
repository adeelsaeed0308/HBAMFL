import * as yup from 'yup';

const formikSchema = {
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: yup.object({
    email: yup
      .string()
      .email('Please Enter a Valid Email')
      .required('Email Missing'),
    password: yup.string().required('Password Missing'),
  }),
};

const formikSchemaForVerify = {
  initialValues: {
    password: '',
  },
  validationSchema: yup.object({
    password: yup.string().required('Password Missing'),
  }),
};

const formikSchemaForResetPassword = {
  initialValues: {
    email: '',
  },
  validationSchema: yup.object({
    email: yup.string().required('Email Missing'),
  }),
}

const formikSchemaResetPassword = {
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validationSchema: yup.object({
    password: yup.string().required('Password Missing'),
    confirmPassword: yup.string().required('Password Missing'),
  }),
}

export { formikSchema, formikSchemaForVerify, formikSchemaResetPassword, formikSchemaForResetPassword };
