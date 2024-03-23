import {
  FormikSubmit,
  FormWrapper,
  FullPageLoad,
  ImageUpload,
  routing,
  Spinner,
  useAxios,
} from 'common';
import { useToast } from 'common/context/Toast';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import formikSchema from './formikSchema';
import { Container } from './styles';

const ChangeImage = () => {
  const [submitLoading, setLoading] = useState(false);
  const { brandId } = useParams();
  const [image, setImage] = useState();
  const { response } = useAxios({
    callOnLoad: { method: 'GET', url: `/brands/${brandId}` },
  });

  const { callAxios: getMeta, loading } = useAxios();
  const { onError, alertSuccess } = useToast();

  const navigate = useNavigate();

  const goBack = () => navigate(routing.brands.root);

  useEffect(() => {
    if (response) {
      const getAllMeta = async () => {
        if (response.data.image) {
          const { data } = await getMeta({
            method: 'GET',
            url: `/files/${response.data.image}`,
            responseType: 'blob',
          });
          const fr = new FileReader();
          fr.onload = () => {
            setImage(fr.result);
          };
          fr.readAsDataURL(data);
        }
      };
      getAllMeta();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const { callAxios } = useAxios();

  const handleSubmit = async (brandName, values) => {
    const imageFile = new File(
      [values.image],
      `${brandName}_image`.replace(/ /g, '_').toLowerCase() +
        values.image.type.replace('image/', '.'),
    );
    const data = new FormData();
    data.append('file', imageFile);
    const res = await callAxios({
      method: 'POST',
      url: '/files/upload',
      data,
      headers: {
        'Content-Type': 'blob',
      },
    });
    await callAxios({
      method: 'PUT',
      url: `/brands/${brandId}`,
      data: { image: res.data.filename },
    });
  };

  if (response) {
    const { data: brand } = response;
    return (
      <Container>
        <h1>{brand.name}</h1>
        {loading ? (
          <Spinner inline />
        ) : image ? (
          <h3>
            Current Image: <img src={image} alt="Brand" height="50px" />
          </h3>
        ) : (
          <h3>No Current Image</h3>
        )}
        <Formik
          {...formikSchema}
          onSubmit={(values) => {
            setLoading(true);
            handleSubmit(brand.name, values)
              .then(() => {
                alertSuccess(`Image Successfully Modified!`);
                goBack();
              })
              .catch(onError)
              .finally(() => setLoading(false));
          }}
        >
          <FormWrapper>
            <Form>
              <Field name="image" component={ImageUpload} label="Image" />
            </Form>
            <FormikSubmit loading={submitLoading}>Update Image</FormikSubmit>
          </FormWrapper>
        </Formik>
      </Container>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default ChangeImage;
