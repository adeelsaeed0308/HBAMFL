import {
  Button,
  Column,
  FileUpload,
  FormikSubmit,
  FormWrapper,
  getApiPath,
  ItemSplitter,
  PageContainer,
  routing,
  TopBar,
  useAxios,
} from "common";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";

const BulkImport = () => {
  const { home } = routing;
  const { callAxios, loading } = useAxios({
    alertSuccess: "Data Imported Successfully!",
  });
  return (
    <PageContainer>
      <TopBar>
        <h1>Bulk Import</h1>
        <div>
          <a
            href={getApiPath("brandRequests/templates/import")}
            target="_blank"
            rel="noreferrer"
          >
            <Button>Download Template</Button>
          </a>
        </div>
      </TopBar>
      <Formik
        initialValues={{ file: "" }}
        validationSchema={yup.object({
          file: yup.mixed().required(),
        })}
        onSubmit={({ file }) => {
          const data = new FormData();
          data.append("import", file);
          callAxios({
            method: "POST",
            url: `/brandRequests/import`,
            data,
            headers: {
              "Content-Type": "blob",
            },
          });
        }}
      >
        <FormWrapper>
          <Form>
            <Column>
              <Field name="file" component={FileUpload} accept={[".xlsx"]} />
            </Column>
          </Form>
          <ItemSplitter autoWidth>
            <FormikSubmit loading={loading}>Import</FormikSubmit>
            <Link to={home}>
              <Button secondary>Cancel</Button>
            </Link>
          </ItemSplitter>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default BulkImport;
