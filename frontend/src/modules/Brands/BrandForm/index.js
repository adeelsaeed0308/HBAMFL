import {
  Button,
  Column,
  downloadFile,
  Dropdown,
  FileUpload,
  FormikSubmit,
  FormWrapper,
  generateLinkWithParams,
  ImageUpload,
  ItemSplitter,
  Link,
  linkPlaceholders,
  PageContainer,
  routing,
  TextField,
  useAlertModal,
  useAxios,
  useBrands,
  useCategories,
  useCurrencies,
  useSuggestBrandListModal,
} from "common";
import { useToast } from "common/context/Toast";
import { Field, Formik, getIn } from "formik";
import { clone, dissoc, __ } from "ramda";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "./styles.js";

const BrandForm = ({ isEdit, formikSchema, parentBrand }) => {
  const { onError, alertSuccess } = useToast();
  const { brandId } = useParams();

  const [overseasChecked, setOverseasChecked] = useState(false);
  const alert = useAlertModal("Please Ensure Up-front Payment");


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const goBack = (id) =>
    navigate(
      !id
        ? routing.brands.root
        : generateLinkWithParams(routing.brands.view, {
          [linkPlaceholders.brandId]: id,
        })
    );
  const { callAxios } = useAxios();
  const { callAxios: getSampleFile, loading: loadingSampleFile } = useAxios({
    onComplete: ({ data: sampleFile }) => {
      downloadFile(sampleFile);
    },
  });

  const { currencies, currencyOptions } = useCurrencies();

  const { categories: categoryOptions } = useCategories();

  const { brands: brandOptions } = useBrands();

  const getCurrencyObject = (code) => currencies.find((c) => c.code === code);

  const handleSubmitEdit = async (values) => {
    return callAxios({
      method: "PUT",
      url: `/brands/${values.id}`,
      data: dissoc("id", {
        ...values,
        currency: getCurrencyObject(values.currency),
        isOverseas: overseasChecked
      }),
    });
  };

  const suggestCreateBrandList = useSuggestBrandListModal();

  const handleSubmit = async (oldValues) => {
    const values = {
      ...clone(oldValues),
      currency: getCurrencyObject(oldValues.currency),
    };
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
      method: "POST",
      url: "/brands",
      data: dissoc("lineItemsFile", values),
    });
  };

  const handleFileUpload = async (file, fileBrandId) => {
    if (file) {
      const data = new FormData();
      data.append("itemsExcel", file);
      await callAxios({
        method: "POST",
        url: `/brands/${fileBrandId}/upload`,
        data,
        headers: {
          "Content-Type": "blob",
        },
      });
    }
  };

  const generateLink = generateLinkWithParams(__, {
    [linkPlaceholders.brandId]: brandId,
  });
  const handleCheckboxChange = (e) => {
    const value = e.target.checked;
    console.log('e', e.target.checked)
    setOverseasChecked(value)

  }
  console.log('overseasChecked', overseasChecked)

  return (
    <PageContainer>
      <h1>
        {parentBrand
          ? `Add Pricesheet to ${parentBrand}`
          : isEdit
            ? "Update Brand"
            : "Add Brand"}
      </h1>
      <Formik
        enableReinitialize
        {...formikSchema}
        onSubmit={(values) => {
          setLoading(true);
          console.log('values', values)
          const submitFunction = isEdit ? handleSubmitEdit : handleSubmit;
          submitFunction(values)
            .then(async (res) => {
              const id = getIn(res, "data.id");
              const newBrand = res.data;
              setLoading(false);
              if (values.lineItemsFile) {
                setLoading(true);
                handleFileUpload(values.lineItemsFile, id)
                  .then(async () => {
                    alertSuccess(
                      `Brand Successfully ${isEdit ? "Update" : "Create"}d!`
                    );
                    goBack(id);
                  })
                  .catch(() => {
                    goBack(id);
                  })
                  .finally(() => setLoading(false));
              } else {
                alertSuccess(
                  `Brand Successfully ${isEdit ? "Update" : "Create"}d!`
                );
                if (newBrand?.category) {
                  const { data } = await callAxios({
                    method: "POST",
                    url: "/brandList/exists",
                    data: { name: newBrand.name },
                  });
                  if (!data) suggestCreateBrandList({ data: newBrand });
                }
                goBack(id);
              }
            })
            .catch((err) => {
              onError(err);
              setLoading(false);
            });
        }}
      >
        <FormWrapper>
          <Form style={{ display: "flex" }}>
            <Column style={{ width: "100%" }}>
              <ItemSplitter>
                <Field
                  name="category"
                  component={Dropdown}
                  label="Category"
                  options={categoryOptions}
                />
                {!parentBrand && (
                  <Field
                    name="parentBrand"
                    component={Dropdown}
                    label="Parent Brand"
                    options={brandOptions}
                  />
                )}
              </ItemSplitter>
              <ItemSplitter>
                <Field
                  name="name"
                  component={TextField}
                  label={parentBrand ? "Pricesheet Name" : "Name"}
                  required
                  fillWidth
                  allBorders
                />
                <Field
                  name="tabName"
                  component={TextField}
                  label={"Tab Name"}
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <ItemSplitter
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Field
                  name="currency"
                  component={Dropdown}
                  label="Currency"
                  options={currencyOptions}
                  required
                  style={{ flex: 1 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  <label
                    htmlFor="overseas"
                    style={{
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ marginLeft: "40px" }}> Overseas </span>
                  </label>
                  <Field
                    name="overseas"
                    component="input"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    checked={overseasChecked}
                    id="overseas"
                    style={{
                      marginLeft: "65px",
                      marginTop: "6px",
                      transform: "scale(1.2)",
                    }}

                  />
                </div>
              </ItemSplitter>

              <Field
                name="suggestedMargin"
                component={TextField}
                label="Suggested Margin %"
                type="number"
                required
                fillWidth
                allBorders
              />
              <ItemSplitter>
                <Field
                  name="minimumMargin"
                  component={TextField}
                  label="Min. Margin %"
                  type="number"
                  required
                  fillWidth
                  allBorders
                />
                <Field
                  name="maximumMargin"
                  component={TextField}
                  label="Max. Margin %"
                  type="number"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <ItemSplitter>
                <Field
                  name="shippingCost"
                  component={TextField}
                  label="Shipping Cost %"
                  type="number"
                  fillWidth
                  allBorders
                />
                <Field
                  name="commissionCost"
                  component={TextField}
                  label="Commission Cost %"
                  type="number"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <Field
                name="otherCosts"
                component={TextField}
                label="Other Costs %"
                type="number"
                fillWidth
                allBorders
              />
              <ItemSplitter>
                <Field
                  name="minimumOrderDollarAmount"
                  component={TextField}
                  label="Min Order Amount"
                  type="number"
                  fillWidth
                  allBorders
                />
                <Field
                  name="minimumOrderItems"
                  component={TextField}
                  label="Min Order Items"
                  type="number"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <ItemSplitter>
                <Field
                  name="maximumOrderDollarAmount"
                  component={TextField}
                  label="Max Order Amount"
                  type="number"
                  fillWidth
                  allBorders
                />
                <Field
                  name="maximumOrderItems"
                  component={TextField}
                  label="Max Order Items"
                  type="number"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <Field
                name="soldByCaseOnly"
                component={Dropdown}
                label="Sold By Case Only"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                required
              />
              <ItemSplitter>
                <Field
                  name="fobPoint"
                  component={TextField}
                  label="Fob Point"
                  fillWidth
                  allBorders
                />
                <Field
                  name="leadTime"
                  component={TextField}
                  label="Lead Time"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <ItemSplitter>
                <Field
                  name="specialDiscountNotes"
                  component={TextField}
                  label="Special Discount Notes"
                  fillWidth
                  allBorders
                />
                <Field
                  name="notes"
                  component={TextField}
                  label="Notes"
                  fillWidth
                  allBorders
                />
              </ItemSplitter>
              <ItemSplitter
                style={{ display: "flex", justifyContent: "end" }}
                autoWidth
              >
                <FormikSubmit loading={loading}>
                  {isEdit ? "Update" : "Add"}
                </FormikSubmit>
                <Button secondary onClick={() => goBack(brandId)}>
                  Cancel
                </Button>
              </ItemSplitter>
            </Column>
            {isEdit ? (
              <Column style={{ fontSize: "0.75rem" }}>
                <div>
                  <Link to={generateLink(routing.brands.changeImage)}>
                    <Button secondary>Change Image</Button>
                  </Link>
                </div>
                <div>
                  <Link to={generateLink(routing.brands.changeFile)}>
                    <Button secondary>Upload Items</Button>
                  </Link>
                </div>
                <div>
                  <Link to={generateLink(routing.brands.attachments)}>
                    <Button secondary>View / Edit Attachments</Button>
                  </Link>
                </div>
              </Column>
            ) : (
              <Column>
                <Field name="image" component={ImageUpload} label="Image" />
                <h3>Brand Items</h3>
                <ItemSplitter>
                  <Field name="lineItemsFile" component={FileUpload} />
                  <Button
                    loading={loadingSampleFile}
                    secondary
                    onClick={() => {
                      getSampleFile({
                        method: "GET",
                        url: "/brands/downloadSampleExcel",
                        responseType: "blob",
                      });
                    }}
                  >
                    Download Sample
                  </Button>
                </ItemSplitter>
              </Column>
            )}
          </Form>
        </FormWrapper>
      </Formik>
    </PageContainer>
  );
};

export default BrandForm;
