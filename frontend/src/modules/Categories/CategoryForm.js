import {
  Button,
  Column,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  PageContainer,
  routing,
  TextField,
  useAxios,
} from "common";
import { Field, Formik } from "formik";
import { dissoc } from "ramda";
import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryForm = ({ isEdit, formikSchema, onCancel, onComplete }) => {
  const navigate = useNavigate();
  const goBack = () => navigate(routing.categories.root);
  const { callAxios, loading } = useAxios({
    alertSuccess: `Category ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: (cat) => {
      onComplete ? onComplete(cat?.data) : goBack();
    },
  });
  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"} Category</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/categories${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", data),
          });
        }}
      >
        <FormWrapper>
          <Column>
            <Field name="name" component={TextField} label="Name" required />
            <Field
              name="sortOrder"
              component={TextField}
              type="number"
              label="Sort Order"
            />
          </Column>
          <ItemSplitter autoWidth>
            <FormikSubmit loading={loading}>
              {isEdit ? "Update" : "Add"}
            </FormikSubmit>
            <Button
              secondary
              onClick={() => {
                onCancel ? onCancel() : goBack();
              }}
            >
              Cancel
            </Button>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default CategoryForm;
