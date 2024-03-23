import { RowFlex } from "common/styles";
import { Field, Form, Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import TextField from "../TextField";

const removeNullsFromObject = (filterConfig = [], obj = {}) => {
  return filterConfig.reduce((acc, { name: key, type }) => {
    const value = obj[key];
    if (value) {
      const isInput = type === "input";
      const filterObject = isInput
        ? {
            $regex: value,
            $options: "i",
          }
        : value;

      let baseSearch = { [key]: filterObject };
      if (Array.isArray(filterObject) && filterObject.length === 0) {
        baseSearch = {};
      }

      const thisPayload = isInput
        ? { $or: [baseSearch, { [`${key}NoSpaces`]: filterObject }] }
        : baseSearch;
      if (acc) {
        return { ...acc, ...thisPayload };
      }
      return thisPayload;
    }
    return acc;
  }, undefined);
};

const Filters = ({
  filterConfig = [],
  setFilters = () => {},
  initialFilters = null,
}) => {
  const initialValues = { ...initialFilters };
  if (initialFilters && initialFilters["$or"]) {
    for (let i = 0; i < initialFilters["$or"].length; i++) {
      const element = initialFilters["$or"][i];
      Object.keys(element).forEach((key) => {
        initialValues[key] = element[key]["$regex"];
      });
    }
  }

  filterConfig.reduce(
    (acc, { name, type }) => ({ ...acc, [name]: type === "input" ? "" : null }),
    {}
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        setFilters(removeNullsFromObject(filterConfig, values));
      }}
    >
      <FormPart filterConfig={filterConfig} />
    </Formik>
  );
};

const FormPart = ({ filterConfig = [] }) => {
  const { submitForm, values } = useFormikContext();
  return (
    <Form>
      <RowFlex responsive>
        {filterConfig.map(({ name, type, ...rest }) => {
          const Component = type === "input" ? TextField : Dropdown;
          return (
            <Field
              key={name}
              component={Component}
              name={name}
              {...rest}
              isClearable
              onChange={() => {
                submitForm(values);
              }}
            />
          );
        })}
      </RowFlex>
    </Form>
  );
};

const useFilters = ({
  filterConfig = [],
  recallFunction = () => {},
  initialFilters = null,
}) => {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    recallFunction({ filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filtersComponent = (
    <Filters
      filterConfig={filterConfig}
      setFilters={setFilters}
      initialFilters={initialFilters}
    />
  );
  return { filters, filtersComponent, setFilters };
};

export default useFilters;
