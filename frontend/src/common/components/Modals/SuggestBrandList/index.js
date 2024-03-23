import { useModalContext } from "common/context";
import { Column, FormWrapper, ItemSplitter } from "common/styles";
import React from "react";
import { useAxios } from "../../../axios";
import { Button, FormikSubmit } from "../../Buttons";
import { SuggestBrandListModalComponent } from "./styles";
import { Field, Form, Formik } from "formik";
import Dropdown from "common/components/Dropdown";
import { brandClassDropdownList } from "common/config";
import * as yup from "yup";

const formikSchema = {
  initialValues: {
    class: "",
  },
  validationSchema: yup.object({
    class: yup.string().required("Class is required"),
  }),
};
const SuggestBrandListModal = ({
  onComplete = () => {},
  closeModal = () => {},
  data,
}) => {
  const { callAxios, loading } = useAxios({
    alertSuccess: "BrandList Created Successfully",
    onComplete,
  });

  const params = {
    method: "POST",
    url: "/brandList",
    data: {
      name: data.name,
      category: data.category,
      brand: data.id,
      isNewBrand: true,
      image: data?.image,
    },
  };

  return (
    <SuggestBrandListModalComponent>
      <h3>Do you want to create BrandList for this Brand?</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          callAxios({
            ...params,
            data: {
              ...params.data,
              class: "A",
            },
          });
          closeModal();
        }}
      >
        <FormWrapper>
          <Form>
            <Field
              name="class"
              component={Dropdown}
              label="Class"
              options={brandClassDropdownList}
              required
            />

            <FormikSubmit loading={loading}>Yes, create.</FormikSubmit>
            <Button secondary onClick={closeModal}>
              No
            </Button>
          </Form>
        </FormWrapper>
      </Formik>
    </SuggestBrandListModalComponent>
  );
};

const useSuggestBrandListModal = () => {
  const { setModalContent, closeModal } = useModalContext();
  const openModal = ({ data }) => {
    setModalContent(
      <SuggestBrandListModal closeModal={closeModal} data={data} />
    );
  };

  return openModal;
};

export { SuggestBrandListModal, useSuggestBrandListModal };
