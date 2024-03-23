import { FullPageLoad, useAxios } from 'common';
import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from '../UserForm';
import validationSchema from '../validationSchema';

const EditUser = () => {
  const { userId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: 'GET', url: `/users/${userId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <UserForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditUser;
