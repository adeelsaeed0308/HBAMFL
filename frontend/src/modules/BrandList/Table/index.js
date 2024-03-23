import { Email } from "@carbon/icons-react";
import {
  allBrandClasses,
  brandClassDropdownList,
  Button,
  downloadFile,
  Dropdown,
  DropdownButton,
  FormikSubmit,
  FormWrapper,
  OverflowContainer,
  RowFlex,
  Spinner,
  TextStyledLink,
  Toggle,
  useAxios,
  useFilters,
  useLoginContext,
  useModalContext,
} from "common";
import { orderBy } from "lodash";
import { uniq } from "ramda";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import BrandAddLine from "./BrandAddLine";
import BrandListForm from "./BrandListForm";
import BrandListLine from "./BrandListLine";
import EmailForm from "./EmailForm";
import {
  CategoryColumn,
  CategoryColumnHeader,
  Columns,
  Container,
} from "./styles";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

const NEW_BRANDS_CATEGORY = "NEW_BRANDS_CATEGORY";
const INACTIVE_BRANDS = "INACTIVE_BRANDS";
const POTENTIAL_BRANDS = "POTENTIAL_BRANDS";

const BrandListTable = () => {
  const { setModalContent, closeModal } = useModalContext();
  const { isBrandListAdmin } = useLoginContext();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const hasSelection = selectedCategoryIds.length > 0;

  const { callAxios, loading: exportLoading } = useAxios({
    onComplete: ({ data }) => {
      downloadFile(data, "Brand List.xlsx");
    },
  });

  const [brandList, setBrandList] = useState([]);
  const newBrands = brandList.filter(
    (bl) => bl.showAsNewBrand && !bl.isInactive && !bl.isPotential
  );
  const inactiveBrands = brandList.filter((bl) => bl.isInactive);
  const potentialBrands = brandList.filter(
    (bl) => bl.isPotential && !bl.isInactive
  );

  const {
    refetch,
    loading,
    callAxios: getBrands,
  } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/brandList",
      params: { limit: 1000000, populate: "category inactiveBy" },
    },
    onComplete: (d) => setBrandList(d?.data.data || []),
  });

  const { response: cResponse, loading: cLoading } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/categories",
      params: { limit: 1000000, filters: { sortOrder: { $exists: true } } },
    },
  });

  const categories = orderBy(
    uniq(
      [
        ...brandList.map((b) => b.category),
        ...(cResponse?.data.data || []),
      ].filter(Boolean)
    ),
    ["sortOrder", (c) => c.name.trim().toLowerCase()]
  );

  const recallFunction = ({ filters }) => {
    getBrands({
      method: "GET",
      url: "/brandList",
      params: {
        limit: 1000000,
        populate: "category inactiveBy",
        filters,
      },
    });
  };

  const { filtersComponent } = useFilters({
    filterConfig: [
      {
        name: "name",
        type: "input",
        label: "Search Brands",
      },
      {
        name: "class",
        type: "dropdown",
        label: "Filter Class",
        options: brandClassDropdownList,
        isMulti: true,
      },
    ],
    recallFunction,
  });

  const { callAxios: addOrDeleteBrand, loading: addLoading } = useAxios({
    onComplete: () => {
      closeModal();
      refetch();
    },
  });

  const deleteBrand = (id) => {
    addOrDeleteBrand({ url: `/brandList/${id}`, method: "DELETE" });
  };

  const formProps = {
    close: closeModal,
    refetch,
    onDelete: deleteBrand,
    deleteLoading: addLoading,
  };

  const [isAddDate, setIsAddDate] = useState(false);
  const [isAddClass, setIsAddClass] = useState(false);

  const onExport = ({
    hasBrands,
    skipBrands,
    classes,
    hasDate = false,
    inactiveOnly,
    potentialOnly,
    hasClass = false
  }) => {
    const defaultFilters = {
      categoryIds: selectedCategoryIds.join(","),
      hasDate,
      hasClass,
      inactiveOnly,
      potentialOnly,
    };
    let params = defaultFilters;
    if (hasBrands) {
      params = { ...defaultFilters, hasBrands: true };
    } else if (skipBrands) {
      params = { ...defaultFilters, skipBrands: true };
    }
    let data = {};
    if (classes) {
      params = { ...defaultFilters, classes: classes.join(",") };
    }

    callAxios({
      method: "GET",
      url: "/brandList/export",
      responseType: "blob",
      params,
      data,
    });
  };

  const { response } = useAxios({
    clearResponse: false,
    callOnLoad: {
      method: "GET",
      url: `/brands`,
    },
  });

  const responseData = response?.data.data;

  const exportOptions = [
    <div key="exportAll" onClick={() => onExport({ hasDate: isAddDate, hasClass: isAddClass })}>
      All
    </div>,
    <div
      key="exportWithBrands"
      onClick={() => onExport({ hasBrands: true, hasDate: isAddDate, hasClass: isAddClass })}
    >
      With pricesheets
    </div>,
    <div
      key="exportWithoutBrands"
      onClick={() => onExport({ skipBrands: true, hasDate: isAddDate, hasClass: isAddClass })}
    >
      Without pricesheets
    </div>,
    <div
      key="exportWithSelectedClasses"
      onClick={() =>
        setModalContent(
          <ExportByClassForm
            close={closeModal}
            onExport={onExport}
            isAddDate={isAddDate}
            isAddClass={isAddClass}
          />
        )
      }
    >
      With Selected Classes
    </div>,
    <div
      key="exportWithAllClasses"
      onClick={() => onExport({ classes: allBrandClasses, hasDate: isAddDate, hasClass: isAddClass })}
    >
      With All Class
    </div>,
  ];

  return (
    <Container>
      <RowFlex extend responsive>
        <RowFlex>
          <h3>Brand List</h3>
          {(loading || cLoading || addLoading) && <Spinner inline />}
        </RowFlex>
        <RowFlex responsive>
          <div style={{ width: "400px" }}>{filtersComponent}</div>
          {isBrandListAdmin && (
            <Button
              loading={addLoading}
              fit
              onClick={() => {
                setModalContent(<BrandListForm {...formProps} />);
              }}
            >
              +
            </Button>
          )}
          <DropdownButton
            loading={exportLoading}
            secondary
            options={exportOptions}
            fit
          >
            Export {hasSelection && "Selected"}
          </DropdownButton>
          <Toggle
            fit
            label="Add Date"
            checked={isAddDate}
            onChange={() => setIsAddDate((p) => !p)}
          />
          <Toggle
            fit
            label="Add Class"
            checked={isAddClass}
            onChange={() => setIsAddClass((p) => !p)}
          />
          <Button
            fit
            loading={exportLoading}
            onClick={() => {
              setModalContent(
                <EmailForm
                  close={closeModal}
                  selectedCategoryIds={selectedCategoryIds}
                />
              );
            }}
          >
            <Email />
            Email {hasSelection && "Selected"}
          </Button>
        </RowFlex>
      </RowFlex>

      <OverflowContainer>
        <Columns responsive>
          {[
            ...categories,
            { name: "New Brands", id: NEW_BRANDS_CATEGORY },
            { name: "Potential Brands", id: POTENTIAL_BRANDS },
            { name: "Inactive Brands", id: INACTIVE_BRANDS },
          ].map(({ name, id }) => {
            const checked = selectedCategoryIds.includes(id);
            const isNewBrands = id === NEW_BRANDS_CATEGORY;
            const isInactiveBrands = id === INACTIVE_BRANDS;
            const isPotentialBrands = id === POTENTIAL_BRANDS;
            const categoryBrands = isNewBrands
              ? newBrands
              : isInactiveBrands
              ? inactiveBrands
              : isPotentialBrands
              ? potentialBrands
              : brandList.filter(
                  (b) => b.category.id === id && !b.isInactive && !b.isPotential
                );
            if (
              (isInactiveBrands && inactiveBrands.length === 0) ||
              (isPotentialBrands && potentialBrands.length === 0)
            )
              return null;
            return (
              <CategoryColumn key={id}>
                <CategoryColumnHeader extend>
                  {name}{" "}
                  {isInactiveBrands || isPotentialBrands ? (
                    <TextStyledLink
                      light
                      onClick={() =>
                        onExport({
                          inactiveOnly: isInactiveBrands,
                          potentialOnly: isPotentialBrands,
                        })
                      }
                    >
                      <FaDownload />
                    </TextStyledLink>
                  ) : (
                    !isInactiveBrands &&
                    !isPotentialBrands && (
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedCategoryIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((p) => p !== id)
                              : [...prev, id]
                          )
                        }
                      />
                    )
                  )}
                </CategoryColumnHeader>
                <OverflowContainer>
                  {orderBy(categoryBrands, (b) => b.name?.toLowerCase()).map(
                    (brand) => {
                      return (
                        <BrandListLine
                          key={brand.id}
                          brand={brand}
                          formProps={formProps}
                          setBrandList={setBrandList}
                          isNewBrands={isNewBrands}
                          data={responseData}
                        />
                      );
                    }
                  )}
                </OverflowContainer>
                {!isNewBrands &&
                  !isInactiveBrands &&
                  !isPotentialBrands &&
                  isBrandListAdmin && (
                    <BrandAddLine
                      onSubmit={(v) => {
                        const data = { category: id, ...v, isNewBrand: true };
                        addOrDeleteBrand({
                          method: "POST",
                          url: "/brandList",
                          data,
                        });
                      }}
                    />
                  )}
              </CategoryColumn>
            );
          })}
        </Columns>
      </OverflowContainer>
    </Container>
  );
};

export default BrandListTable;

const ExportByClassForm = ({ close, onExport, isAddDate, isAddClass }) => {
  const formikSchema = {
    initialValues: {
      class: null,
    },
    validationSchema: yup.object({
      class: yup.array().of(yup.string()).required(),
    }),
  };

  const exportByClass = (classes) => {
    onExport({ classes, hasDate: isAddDate, hasClass: isAddClass });
    close();
  };

  return (
    <div>
      <h3>Export By Class</h3>
      <Formik
        {...formikSchema}
        onSubmit={(values) => {
          exportByClass(values.class);
        }}
      >
        {(props) => {
          return (
            <FormWrapper>
              <Form>
                <Field
                  component={Dropdown}
                  label="Class"
                  required
                  name="class"
                  isMulti
                  value={props.values.class}
                  options={brandClassDropdownList}
                />
              </Form>
              <FormikSubmit>Submit</FormikSubmit>
            </FormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};
