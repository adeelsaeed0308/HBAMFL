import {
  Button,
  Dropdown,
  FormikSubmit,
  FormWrapper,
  ItemSplitter,
  PageContainer,
  routing,
  TextField,
  Toggle,
  useAxios,
} from "common";
import { Field, Form, Formik } from "formik";
import { dissoc } from "ramda";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserForm = ({ isEdit, formikSchema }) => {
  const navigate = useNavigate();
  const goBack = () => navigate(routing.users.root);
  const { callAxios, loading } = useAxios({
    alertSuccess: `User ${isEdit ? "Updated" : "Added"} Successfully!`,
    onComplete: goBack,
  });

  const [isExportWithCost, setIsExportWithCost] = useState();

  const options = [
    { value: "", label: "None" },
    { value: "Admin", label: "Admin" },
    { value: "SalesRep", label: "Sales Rep" },
  ];

  const { userId } = useParams();

  return (
    <PageContainer>
      <h1>{isEdit ? "Update" : "Add"}User</h1>
      <Formik
        {...formikSchema}
        onSubmit={(data) => {
          callAxios({
            method: isEdit ? "PUT" : "POST",
            url: `/users${isEdit ? `/${data.id}` : ""}`,
            data: dissoc("id", data),
          });
        }}
      >
        {({ values, handleChange }) => {
          if (
            values.isKanda &&
            (values.priceSheetsRole !== "SalesRep" ||
              values.sourcingRole ||
              values.loansRole ||
              values.brandListRole)
          ) {
            handleChange({
              target: { name: "priceSheetsRole", value: "SalesRep" },
            });
            handleChange({
              target: { name: "brandListRole", value: "" },
            });
            handleChange({
              target: { name: "sourcingRole", value: "" },
            });
            handleChange({
              target: { name: "loansRole", value: "" },
            });
          }
          const disabled = values.isKanda;
          return (
            <FormWrapper>
              <Form>
                <Field
                  name="email"
                  component={TextField}
                  label="Email"
                  required
                />
                <Field
                  name="name"
                  component={TextField}
                  label="Name"
                  required
                />
                <Field name="admin" component={Toggle} required label="Admin" />
                <Field name="isKanda" component={Toggle} required label="K&A" />
                <Field
                  name="exportOriginalWithCost"
                  component={Toggle}
                  required
                  label="Export With Cost"
                />

                <Field
                  name="priceSheetsRole"
                  component={Dropdown}
                  label="Price Sheets Role"
                  options={options}
                  disabled={disabled}
                />
                <Field
                  name="sourcingRole"
                  component={Dropdown}
                  label="Sourcing Role"
                  options={options}
                  disabled={disabled}
                />
                <Field
                  name="loansRole"
                  component={Dropdown}
                  label="Loans Role"
                  options={options.filter((o) => o.value !== "SalesRep")}
                  disabled={disabled}
                />
                <Field
                  name="brandListRole"
                  component={Dropdown}
                  label="Brand List Role"
                  options={options}
                  disabled={disabled}
                />
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
          );
        }}
      </Formik>
    </PageContainer>
  );
};

export default UserForm;
