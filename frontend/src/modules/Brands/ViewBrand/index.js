import {
  Attachments,
  Vendors,
  Button,
  Card,
  CollapsibleHeader,
  Dropdown,
  fetchImage,
  FormikSubmit,
  FullPageLoad,
  generateLinkWithParams,
  isKanda,
  ItemSplitter,
  Link,
  linkPlaceholders,
  routing,
  RowFlex,
  Table,
  TextField,
  TextStyledLink,
  useAlertModal,
  useAxios,
  useCurrencies,
  useLoginContext,
  useModalContext,
  FormWrapper,
  FileUpload,
} from "common";
import { Field, Form, Formik } from "formik";
import { __ } from "ramda";
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmailExportModal from "./EmailExportModal";
import ExcelView from "./ExcelView";
import { formikSchema } from "./formikSchema";
import {
  BrandKpi,
  BrandName,
  Container,
  DetailsContainer,
  ExportActions,
  ExportContainer,
  ExportTab,
  ExportTabs,
  FormWrapperHorizontal,
} from "./styles";
import VendorBrands from "common/modules/VendorBrands";
import Notes from "./Notes";

const ViewBrand = () => {
  const navigate = useNavigate();
  const { setModalContent } = useModalContext();
  const { isPriceSheetsAdmin } = useLoginContext();
  const { currencyOptions } = useCurrencies();
  const [pricesheetId, setPricesheetId] = useState();
  const [onExport, setOnExport] = useState(true);
  const [showChildBrands, setShowChildBrands] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { brandId } = useParams();

  const { refetch, response } = useAxios({
    clearResponse: false,
    callOnLoad: {
      method: "GET",
      url: `/brands/${brandId}`,
      params: {
        populate: JSON.stringify([
          { path: "pricesheets", populate: "childBrands parentBrand" },
          "childBrands",
          "parentBrand",
        ]),
      },
    },
  });

  const { response: currentUser } = useAxios({
    clearResponse: false,
    callOnLoad: {
      method: "GET",
      url: `/auth/me`,
    },
  });

  const parentBrand = response?.data;

  const alert = useAlertModal("Please Ensure Up-front Payment");

  if (!parentBrand) return <FullPageLoad fillWidth />;

  if (parentBrand.brand)
    navigate(
      generateLinkWithParams(routing.brands.view, {
        [linkPlaceholders.brandId]: parentBrand.brand,
      })
    );

  const selectedPricesheetId = pricesheetId || parentBrand.id;
  const isParentBrand = selectedPricesheetId === parentBrand.id;

  const brandSelection = [parentBrand, ...(parentBrand.pricesheets || [])];

  const brand = brandSelection.find((b) => b.id === selectedPricesheetId);
  //shipping = brand.shippingCost;
  // setShipping(brand.shippingCost);
  // setComission(brand.commissionCost);
  // setOther(brand.otherCosts);
  const image = brand.image || parentBrand.image;
  const openModal = (params, show = true, childBrand = undefined) => {
    show &&
      setModalContent(
        <ExcelView brand={childBrand || brand} params={params} />
      );
  };
  const linkParams = { [linkPlaceholders.brandId]: brand.id };
  const {
    currency: { symbol },
  } = brand;
  const hasMaxOrderDollarAmount = !!brand.maximumOrderDollarAmount;
  const amountRange = `${symbol}${numberWithCommas(
    brand.minimumOrderDollarAmount || 0
  )}${
    hasMaxOrderDollarAmount
      ? ` - ${symbol}${numberWithCommas(brand.maximumOrderDollarAmount || 0)}`
      : ""
  }`;
  const hasMaxItemAmount = !!brand.maximumOrderItems;
  const itemRange = `${brand.minimumOrderItems || 0}${
    hasMaxItemAmount ? ` - ${brand.maximumOrderItems || 0}` : ""
  }`;
  const generateLink = generateLinkWithParams(__, linkParams);
  const suggestedMargin = isKanda()
    ? Math.max(brand.suggestedMargin, 30)
    : brand.suggestedMargin;

  const margins = [
    {
      margin: brand.minimumMargin,
      show: !isKanda(),
      title: "Min. Margin",
    },
    {
      margin: suggestedMargin,
      show: true,
      title: "Suggested Margin",
    },
    {
      margin: brand.maximumMargin,
      show: !isKanda(),
      title: "Max. Margin",
    },
  ].map((margin) => {
    return (
      margin.show && (
        <BrandKpi
          key={margin.title}
          onClick={() => {
            const open = () =>
              openModal(
                {
                  margin: margin.margin,
                },
                brand.itemsHaveCostPrice
              );
            if (margin.margin < 12) {
              alert(null, open);
            } else {
              open();
            }
          }}
        >
          <h3>{margin.margin || 0}%</h3>
          <p>{margin.title}</p>
        </BrandKpi>
      )
    );
  });
  return (
    <Container>
      {brandSelection.length > 1 && (
        <RowFlex>
          {brandSelection.map((b) => (
            <div key={b.id}>
              <Button
                fillWidth
                secondary={b.id !== selectedPricesheetId}
                onClick={() => setPricesheetId(b.id)}
              >
                {b.tabName || b.name}
                {b.id === parentBrand.id && " (default)"}
              </Button>
            </div>
          ))}
        </RowFlex>
      )}
      <h1>
        <RowFlex responsive>
          Brand Details{" "}
          {isPriceSheetsAdmin && (
            <Fragment>
              <Link to={generateLink(routing.brands.edit)}>(Edit)</Link>
              {isParentBrand && (
                <Link
                  to={{
                    pathname: routing.brands.add,
                    search: `?brand=${brand.id}`,
                  }}
                >
                  (Add Pricesheet)
                </Link>
              )}
            </Fragment>
          )}
          {brand.parentBrand && (
            <Link
              to={generateLinkWithParams(routing.brands.view, {
                [linkPlaceholders.brandId]: brand.parentBrand.id,
              })}
            >
              (Go to Parent - {parentBrand.name})
            </Link>
          )}
        </RowFlex>
      </h1>
      <DetailsContainer>
        <BrandName>
          {image && <img src={fetchImage(image)} alt="Brand" width="100px" />}
          <h2>{brand.name}</h2>
          {isPriceSheetsAdmin && (
            <Link to={generateLink(routing.brands.changeImage)}>
              (Change Image)
            </Link>
          )}
        </BrandName>
        <ItemSplitter split={isKanda() ? 1 : 3}>{margins}</ItemSplitter>
        {!isKanda() && (
          <BrandKpi>
            <div style={{ display: "grid", height: "100%" }}>
              <p
                style={{
                  textAlign: "left",
                  maxWidth: "fit-content",
                  margin: "auto",
                }}
              >
                <span style={{ display: "inline-block", width: "120px" }}>
                  Shipping Cost:
                </span>
                <strong>{brand.shippingCost}%</strong>
              </p>
              <p
                style={{
                  textAlign: "left",
                  maxWidth: "fit-content",
                  margin: "auto",
                }}
              >
                <span style={{ display: "inline-block", width: "120px" }}>
                  Commission Cost:
                </span>
                <strong>{brand.commissionCost}%</strong>
              </p>
              <p
                style={{
                  textAlign: "left",
                  maxWidth: "fit-content",
                  margin: "auto",
                }}
              >
                <span style={{ display: "inline-block", width: "120px" }}>
                  Other Costs:
                </span>{" "}
                <strong>{brand.otherCosts}%</strong>
              </p>
            </div>
          </BrandKpi>
        )}
        <BrandKpi>
          <h3>{amountRange}</h3>
          <p>{`Min.${hasMaxOrderDollarAmount ? " - Max." : ""} Amount`}</p>
        </BrandKpi>
        <BrandKpi>
          <h3>{itemRange}</h3>
          <p>{`Min.${hasMaxItemAmount ? " - Max." : ""} Number of Items`}</p>
        </BrandKpi>
      </DetailsContainer>
      <Attachments
        url={`/brands/${brand.id}`}
        attachments={brand.attachments}
        onComplete={refetch}
      />
      <Notes brand={brand} />
      {currentUser?.data?.priceSheetsRole == "Admin" && (
        <VendorBrands id={brand.id} onComplete={refetch} />
      )}
      <Fragment width={"auto"}></Fragment>
      <ExportContainer>
        <ExportTabs>
          <ExportTab
            isActive={onExport}
            onClick={() => {
              setOnExport(true);
            }}
          >
            Export
          </ExportTab>
          {!isKanda() && (
            <ExportTab
              isActive={!onExport}
              onClick={() => {
                setOnExport(false);
              }}
            >
              Email
            </ExportTab>
          )}
        </ExportTabs>
        <ExportActions>
          {onExport ? (
            <Formik
              enableReinitialize
              {...formikSchema(
                brand,
                currentUser?.data?.priceSheetsRole,
                currentUser?.data?.email
              )}
              onSubmit={(params) => {
                const open = () => openModal(params);
                if (params.margin < 12) {
                  return alert(null, open);
                }
                return open();
              }}
            >
              {({ handleChange, values }) => {
                return (
                  <>
                    <FormWrapperHorizontal>
                      <Form>
                        <Field
                          name="margin"
                          label={`Profit Margin %${
                            !brand.itemsHaveCostPrice
                              ? " (Items do not have Cost Price)"
                              : ""
                          }`}
                          disabled={!brand.itemsHaveCostPrice || values.isRaw}
                          required
                          component={TextField}
                          type="number"
                          onFocus={() => {
                            handleChange({
                              target: {
                                name: "MSRPDiscount",
                                value: undefined,
                              },
                            });
                          }}
                        />
                        <Field
                          name="MSRPDiscount"
                          label={`Discount %${
                            !brand.itemsHaveMSRP
                              ? " (Items do not have MSRP)"
                              : ""
                          }`}
                          disabled={
                            !brand.itemsHaveMSRP || values.isRaw || isKanda()
                          }
                          component={TextField}
                          type="number"
                          onFocus={() => {
                            handleChange({
                              target: { name: "margin", value: undefined },
                            });
                          }}
                        />
                        <Field
                          name="fromCurrency"
                          label="From Currency"
                          component={Dropdown}
                          options={currencyOptions}
                          disabled
                        />
                        <Field
                          name="toCurrency"
                          label="To Currency"
                          component={Dropdown}
                          options={currencyOptions}
                        />
                      </Form>
                      <FormikSubmit>Export</FormikSubmit>
                    </FormWrapperHorizontal>
                    <br />
                    <br />
                  </>
                );
              }}
            </Formik>
          ) : (
            <EmailExportModal brand={brand} />
          )}
        </ExportActions>
      </ExportContainer>
      {brand.childBrands.length > 0 && (
        <CollapsibleHeader
          header="Child Brands"
          show={showChildBrands}
          setShow={setShowChildBrands}
        />
      )}
      {showChildBrands && (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                {!isKanda() && <th>Min. Margin</th>}
                <th>Suggested Margin</th>
                {!isKanda() && <th>Max. Margin</th>}
              </tr>
            </thead>
            <tbody>
              {brand.childBrands.map((childBrand) => {
                const childSuggestedMargin = isKanda()
                  ? Math.max(childBrand.suggestedMargin, 30)
                  : childBrand.suggestedMargin;
                const childMargins = [
                  {
                    margin: childBrand.minimumMargin,
                    show: !isKanda(),
                    title: "Min. Margin",
                  },
                  {
                    margin: childSuggestedMargin,
                    show: true,
                    title: "Suggested Margin",
                  },
                  {
                    margin: childBrand.maximumMargin,
                    show: !isKanda(),
                    title: "Max. Margin",
                  },
                ].map((margin) => {
                  return (
                    margin.show && (
                      <td
                        key={margin.title}
                        onClick={() => {
                          const open = () =>
                            openModal(
                              {
                                margin: margin.margin,
                              },
                              childBrand.itemsHaveCostPrice,
                              childBrand
                            );
                          if (margin.margin < 12) {
                            alert(null, open);
                          } else {
                            open();
                          }
                        }}
                      >
                        <TextStyledLink>{margin.margin || 0}%</TextStyledLink>
                      </td>
                    )
                  );
                });
                return (
                  <tr key={childBrand.id}>
                    <td>
                      <Link
                        to={generateLinkWithParams(routing.brands.view, {
                          [linkPlaceholders.brandId]: childBrand.id,
                        })}
                      >
                        {childBrand.name}
                      </Link>
                    </td>
                    {childMargins}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
      <CollapsibleHeader
        header="More Options"
        show={showMoreOptions}
        setShow={setShowMoreOptions}
      />
      {showMoreOptions && (
        <div>
          <TextStyledLink
            onClick={() => {
              openModal({
                isRaw: true,
              });
            }}
          >
            Export Original Vendor Cost
          </TextStyledLink>
        </div>
      )}
    </Container>
  );
};

export default ViewBrand;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
