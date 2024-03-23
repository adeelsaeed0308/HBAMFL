import React from 'react';
import UserForm from '../UserForm';
import formikSchema from './formikSchema';

const AddUser = () => {
  return <UserForm formikSchema={formikSchema} />;
};

export default AddUser;
