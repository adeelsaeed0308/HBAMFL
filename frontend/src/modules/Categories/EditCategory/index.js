import { FullPageLoad, useAxios } from 'common';
import React from 'react';
import { useParams } from 'react-router-dom';
import CategoryForm from '../CategoryForm';
import validationSchema from '../validationSchema';

const EditCategory = () => {
  const { categoryId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: 'GET', url: `/categories/${categoryId}` },
  });
  if (response) {
    const formikSchema = {
      initialValues: response.data,
      validationSchema,
    };
    return <CategoryForm formikSchema={formikSchema} isEdit />;
  }
  return <FullPageLoad fillWidth />;
};

export default EditCategory;
