import {
  Button,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  generateLinkWithParams,
  ItemSplitter,
  linkPlaceholders,
  PageContainer,
  routing,
  TextField,
  useAxios,
  useBrandRequests,
  useCategories,
  useLoginContext,
  useUsers,
} from "common";
import MultiValueTextField from "common/components/MultiValueTextField";
import { Field, Form, Formik } from "formik";
import { dissoc } from "ramda";
import React from "react";
import { useNavigate } from "react-router-dom";

const BrandRequestForm = ({ isEdit, formikSchema }) => {
  const { brandRequests } = useBrandRequests();
  const { isSourcingUserOnly, isSourcingAdmin } = useLoginContext();
  const navigate = useNavigate();
  const goBack = () =>
    navigate(isSourcingUserOnly ? routing.home : routing.brandRequests.root);
  const { callAxios, loading } = useAxios({
    alertSuccess: `Brand Request ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: (d) => {
      isSourcingUserOnly
        ? goBack()
        : navigate(
            generateLinkWithParams(routing.brandRequests.view, {
              [linkPlaceholders.brandRequestId]: d.data.id,
            })
          );
    },
  });
  const { categories } = useCategories();
  const users = useUsers();

  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"} Brand Request</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          let brandRequest = {
            ...data,
            brandEmail: data.brandEmail?.filter(Boolean),
          };
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/brandRequests${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", brandRequest),
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Field
              name="parentBrandRequest"
              component={Dropdown}
              label="Parent Brand Request"
              options={brandRequests}
            />
            <Field name="brandName" component={TextField} label="Brand Name" />
            <Field
              name="brandEmail"
              component={MultiValueTextField}
              label="Brand Email"
            />
            <Field name="url" component={TextField} label="Brand URL" />
            {isSourcingAdmin && (
              <Field
                name="requestBy"
                component={Dropdown}
                label="Requested By"
                required
                options={users}
              />
            )}
            <Field
              name="category"
              component={Dropdown}
              label="Category"
              required
              options={categories}
            />
            <Field
              name="requestedByCustomer"
              component={TextField}
              label="Requested By Customer"
            />
            <div style={{ maxWidth: 224 }}>
              <Field name="notes" component={TextField} isArea label="Notes" />
            </div>
          </Form>
          <ItemSplitter autoWidth>
            <FormikSubmit loading={loading}>
              {isEdit ? "Update" : "Add"}
            </FormikSubmit>
            <Button secondary onClick={goBack}>
              Cancel
            </Button>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default BrandRequestForm;
