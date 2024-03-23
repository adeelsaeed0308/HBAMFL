import {
  Button,
  Column,
  Dropdown,
  FormikSubmit,
  ImageUpload,
  RowFlex,
  TextField,
  TextStyledLink,
  Toggle,
  brandClassDropdownList,
  useAxios,
  useBrands,
  useCategories,
} from "common";
import { Field, Formik } from "formik";
import { AddCategory } from "modules/Categories";
import React, { useState } from "react";
import formikSchema from "./formikSchema";
import { Container, InactiveContainer } from "./styles";

const BrandListForm = ({
  brand,
  close,
  refetch,
  onDelete,
  deleteLoading,
  data = [],
}) => {
  const isEdit = !!brand;
  const initialValues = isEdit
    ? {
        name: brand.name,
        category: brand.category?.id || brand.category,
        brand: brand.brand,
        isNewBrand: !!brand.isNewBrand,
        isPotential: !!brand.isPotential,
        potentialNotes: brand.potentialNotes,
        class: brand.class,
      }
    : { isNewBrand: true };
  const { categories, reloadCategories, loading: cLoading } = useCategories();
  const { brands, loading: bLoading } = useBrands();
  const [addCategory, setAddCategory] = useState(false);
  const { callAxios, loading: l } = useAxios({
    alertSuccess: "Item Modified Successfully",
  });
  const brandImage = data.filter((item) => item._id === brand.brand);
  const loading = deleteLoading || l;

  const handleSubmit = async (values) => {
    if (values.image) {
      const imageFile = new File(
        [values.image],
        `${values.name}_image`.replace(/ /g, "_").toLowerCase() +
          values.image.type.replace("image/", ".")
      );
      const data = new FormData();
      data.append("file", imageFile);
      const res = await callAxios({
        method: "POST",
        url: "/files/upload",
        data,
        headers: {
          "Content-Type": "blob",
        },
      });
      values.image = res.data.filename;
    }
    return callAxios({
      method: isEdit ? "PUT" : "POST",
      url: `/brandList${isEdit ? `/${brand.id}` : ""}`,
      data: { ...values, image: values.image || brand?.image },
    });
  };
  return (
    <Formik
      {...formikSchema(initialValues)}
      onSubmit={(v) => {
        console.log("On Submit", v);
        handleSubmit(v).then(() => {
          refetch();
          close();
        });
      }}
    >
      {({ handleChange, values }) => {
        return addCategory ? (
          <AddCategory
            onCancel={() => setAddCategory(false)}
            onComplete={(cat) => {
              handleChange({ target: { name: "category", value: cat?.id } });
              reloadCategories();
              setAddCategory(false);
            }}
          />
        ) : (
          <Container>
            <Column>
              <h3>{isEdit ? "Edit" : "Add"} Brand</h3>
              {brand?.isInactive && (
                <InactiveContainer>
                  <h3>Brand Is Inactive</h3>
                  <p>On: {new Date(brand.inactiveDate).toLocaleDateString()}</p>
                  <p>By: {brand.inactiveBy?.name}</p>
                  <p>
                    Reason:{" "}
                    <span
                      dangerouslySetInnerHTML={{ __html: brand.inactiveReason }}
                    />
                  </p>
                </InactiveContainer>
              )}
              <RowFlex>
                <Field
                  component={Dropdown}
                  name="category"
                  required
                  label="Category"
                  options={categories}
                  loading={cLoading}
                />
                <TextStyledLink
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => setAddCategory(true)}
                >
                  New Category
                </TextStyledLink>
              </RowFlex>
              <Field
                component={Dropdown}
                name="brand"
                label="Brand"
                options={brands}
                loading={bLoading}
                isClearable
              />
              <Field
                component={Dropdown}
                name="class"
                required
                label="Class"
                options={brandClassDropdownList}
                isClearable
              />
              <Field component={TextField} name="name" required label="Name" />
              <Field
                name="image"
                component={ImageUpload}
                label="Image"
                image={
                  brand?.image ||
                  (brandImage.length > 0
                    ? brandImage.map((item) => item.image)
                    : undefined)
                }
              />
              <RowFlex responsive>
                <Field name="isNewBrand" component={Toggle} label="New" />
                <Field
                  name="isPotential"
                  component={Toggle}
                  label="Potential"
                />
              </RowFlex>
              {values.isPotential && (
                <Field
                  name="potentialNotes"
                  component={TextField}
                  label="Potential Notes"
                  isArea
                />
              )}
            </Column>
            <RowFlex>
              <FormikSubmit loading={loading} fit>
                Submit
              </FormikSubmit>
              <Button secondary onClick={close} fit loading={loading}>
                Cancel
              </Button>
              {brand && (
                <Button
                  loading={loading}
                  danger
                  fit
                  onClick={() => onDelete(brand.id)}
                >
                  Delete
                </Button>
              )}
            </RowFlex>
          </Container>
        );
      }}
    </Formik>
  );
};

export default BrandListForm;
