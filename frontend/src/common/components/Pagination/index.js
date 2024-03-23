import { Field, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import Spinner from "../Spinner";
import {
  AllLeft,
  AllRight,
  Container,
  Left,
  Page,
  PageContainer,
  PageInfo,
  Right,
} from "./styles";

const Pagination = ({ limit, setLimit, skip, setSkip, total }) => {
  if (typeof total !== "number") {
    return (
      <Container>
        <Spinner inline />
      </Container>
    );
  }
  const from = Math.min(skip + 1, total);
  const to = Math.min(skip + limit, total);
  const pageCount = Math.ceil(total / limit);
  const currentPage = skip / limit + 1;
  const highestPossibleSkip = limit * (pageCount - 1);
  const pageArray = [-2, -1, 0, 1, 2]
    .map((v) => currentPage + v)
    .filter((page) => page > 0 && page <= pageCount);

  return (
    <Container>
      <PageInfo>
        Showing {from} to {to} of {total} items
        <Formik initialValues={{ limit }}>
          <Field
            name="limit"
            component={Dropdown}
            options={[10, 20, 40].map((value) => ({
              value,
              label: `${value} per page`,
            }))}
            fieldOnly
            onChange={(value) => {
              setLimit(value);
              setSkip(0);
            }}
          />
        </Formik>
      </PageInfo>
      {total > 0 && (
        <PageContainer>
          <Left onClick={() => setSkip(0)} />
          <AllLeft
            onClick={() => setSkip((prev) => Math.max(prev - limit, 0))}
          />
          {!pageArray.includes(1) && (
            <Fragment>
              <Page
                isActive={currentPage === 1}
                onClick={() => {
                  setSkip(0);
                }}
              >
                1
              </Page>
              <div>...</div>
            </Fragment>
          )}
          {pageArray.map((page) => {
            return (
              <Page
                key={page}
                isActive={page === currentPage}
                onClick={() => {
                  setSkip(limit * (page - 1));
                }}
              >
                {page}
              </Page>
            );
          })}
          {!pageArray.includes(pageCount) && (
            <Fragment>
              <div>...</div>
              <Page
                isActive={currentPage === pageCount}
                onClick={() => {
                  setSkip(highestPossibleSkip);
                }}
              >
                {pageCount}
              </Page>
            </Fragment>
          )}
          <AllRight
            onClick={() =>
              setSkip((prev) => Math.min(prev + limit, highestPossibleSkip))
            }
          />
          <Right onClick={() => setSkip(highestPossibleSkip)} />
        </PageContainer>
      )}
    </Container>
  );
};

const usePagination = ({
  total,
  initialLimit = 10,
  initialSkip = 0,
  recallFunction,
}) => {
  const [limit, setLimit] = useState(initialLimit);
  const [skip, setSkip] = useState(initialSkip);

  useEffect(() => {
    recallFunction && recallFunction({ limit, skip });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, skip]);

  const paginationComponent = (
    <Pagination
      total={total}
      limit={limit}
      setLimit={setLimit}
      skip={skip}
      setSkip={setSkip}
    />
  );

  return { paginationComponent, limit, skip, setLimit, setSkip };
};

export { usePagination };
