import {
Button,
downloadFile,
FileUpload,
FormikSubmit,
FormWrapper,
FullPageLoad,
routing,
useAxios
} from 'common';
import { Field,Form,Formik } from 'formik';
import React from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import formikSchema from './formikSchema';
import { Container } from './styles';

const ChangeFile = () => {
  const { brandId } = useParams();
  const { response } = useAxios({
    callOnLoad: { method: 'GET', url: `/brands/${brandId}` },
  });

  const { callAxios: getSampleFile, loading: loadingSampleFile } = useAxios({
    onComplete: ({ data: sampleFile }) => {
      downloadFile(sampleFile);
    },
  });

  const navigate = useNavigate();

  const goBack = () => navigate(routing.brands.root);

  const { callAxios, loading } = useAxios({
    onComplete: goBack,
    alertSuccess: 'File Uploaded Successfully!',
  });

  if (response) {
    const { data: brand } = response;
    return (
      <Container>
        <h1>{brand.name}</h1>
        <h3>Upload Brand Items</h3>
        <Formik
          {...formikSchema}
          onSubmit={(values) => {
            const data = new FormData();
            data.append('itemsExcel', values.lineItemsFile);
            callAxios({
              method: 'POST',
              url: `/brands/${brandId}/upload`,
              data,
              headers: {
                'Content-Type': 'blob',
              },
            });
          }}
        >
          <FormWrapper>
            <Form>
              <Field name="lineItemsFile" component={FileUpload} />
              <Button
                loading={loadingSampleFile}
                secondary
                onClick={() => {
                  getSampleFile({
                    method: 'GET',
                    url: '/brands/downloadSampleExcel',
                    responseType: 'blob',
                  });
                }}
              >
                Download Sample
              </Button>
            </Form>
            <FormikSubmit loading={loading}>Upload File</FormikSubmit>
          </FormWrapper>
        </Formik>
      </Container>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default ChangeFile;
