import { useModalContext } from "common/context";
import { useFiltersAndPagination, useListView } from "common/hooks";
import {
  DeleteIcon,
  Link,
  PinIcon,
  PinnedIcon,
  RowFlex,
  TopBar,
} from "common/styles";
import { Field, Formik } from "formik";
import { omit } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { baseURL, useAxios } from "../../axios";
import { Button } from "common";
import Dropdown from "../Dropdown";
import { DeleteItemModal } from "../Modals";
import { Grid } from "./Grid";
import { List, Table } from "./List";
import { BulkAction, Container, TableContainer } from "./styles";

const TableView = ({
  tableName = "",
  ActionComponent = () => <div>Component</div>,
  actionComponentProps = {},
  actionLink = "",
  actionModal = false,
  actionName = "",
  additionalActions = [],
  additionalLinkParams = {},
  bulkActions = [],
  darker = false,
  dataGrid = false,
  defaultFilters = {},
  defaultParams = {},
  deleteMessage = () => "Delete Item",
  deleteUrl,
  pinUrl,
  filterConfig = [],
  gridColumns = 3,
  gridConfig,
  gridHeaderComponentFunction = () => <div />,
  gridHeadingFunction = () => "",
  header = "Table",
  HeaderComponent = () => null,
  height = "65vh",
  initialSort = localStorage.getItem("sort" + header) || "-createdAt",
  linkParam,
  navLinks = [],
  actionLinks = [],
  noHeader = false,
  onActionComplete = () => {},
  searchParams = "",
  shapeData = (res) => res.data.data,
  sortConfig = [],
  tableConfig = [],
  defaultAction = null,
  to = "",
  url,
  selectedStatus,
  initialSkip,
  initialLimit,
  initialFilters,
  sendFiltersToParent,
}) => {
  const sortOptions = sortConfig.reduce(
    (acc, sc) => [
      ...acc,
      { value: sc.name, label: `${sc.header} Asc.` },
      { value: `-${sc.name}`, label: `${sc.header} Desc.` },
    ],
    []
  );
  const hasBulkActions = bulkActions.length > 0;
  const [selectedIds, setSelectedIds] = useState([]);
  const [sort, setSort] = useState(initialSort);
  const { isList, listViewComponent: lvc } = useListView();
  const makeFilters = (propFilters) => {
    if (propFilters || defaultFilters) {
      return {
        ...(propFilters || {}),
        ...(defaultFilters || {}),
        ...(defaultParams?.filters || {}),
      };
    }
    
  };
  const { setModalContent, closeModal } = useModalContext();

  const { response, callAxios, loading, setResponse } = useAxios();

  const { callAxios: pinItemAxios } = useAxios({
    alertSuccess: "Pinned Successfully",
    onComplete: () => {
      setSkip(0);
      reloadTable();
      onActionComplete();
    },
  });

  const onPin = (item) => {
    pinItemAxios({
      url: pinUrl(item.id),
    });
  };
  const recallFunction = (props) => {
    // console.log(props, "====> props")
    setSelectedIds([]);
    callAxios({
      url,
      method: "GET",
      params: {
        limit: dataGrid ? 10000000 : props.limit,
        sort,
        skip: dataGrid ? 0 : props.skip,
        filters: makeFilters(props.filters),
        ...omit(defaultParams, ["filters"]),
      },
    });
  };
  const {
    paginationComponent,
    filtersComponent,
    limit,
    skip,
    filters,
    setSkip,
  } = useFiltersAndPagination({
    total: response?.data.pagination.total,
    filterConfig,
    recallFunction,
    initialSkip: (typeof initialSkip === "number" && initialSkip) || 0,
    initialLimit: (typeof initialLimit === "number" && initialLimit) || 10,
    initialFilters: initialFilters ?? null,
  });

  const reloadTable = () => recallFunction({ limit, skip, filters });

  useEffect(() => {
    if (sessionStorage.getItem(`${tableName}-selectedItemId`)) {
      let element = document.getElementById(
        sessionStorage.getItem(`${tableName}-selectedItemId`) + "-checkbox"
      );
      if (element) {
        element.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
        const timeout = setTimeout(() => {
          sessionStorage.removeItem(`${tableName}-selectedItemId`);
        }, 3 * 1000);

        return () => {
          clearTimeout(timeout);
        };
      }
    }
  }, [response]);

  useEffect(() => {
   sendFiltersToParent && sendFiltersToParent(filters || {});
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.removeItem(`${tableName}-skip`);
      sessionStorage.removeItem(`${tableName}-limit`);
      sessionStorage.removeItem(`${tableName}-filters`);
    }, 3 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    reloadTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultParams), JSON.stringify(defaultFilters), sort]);

  const hasAction =
    (actionName && (actionLink || actionModal)) || additionalActions.length > 0;
  // console.log(response)
  let shapedData;
  try {
    shapedData = response ? shapeData(response) : [];
  } catch {
    shapedData = response ? response.data.data : [];
  }

  // console.log(selectedStatus)

  // let index = 0;

  // const shapedDataOrder = shapedData.map(data => {
  //   index++;

  //   return {
  //     ...data,
  //     order: index,
  //   };
  // });

  const filterElement =
    !dataGrid && filterConfig?.length > 0 && filtersComponent;
  const View = isList || dataGrid ? List : Grid;

  const bulkActionsElementForGrid = !isList && hasBulkActions && (
    <BulkAction
      checked={shapedData.length === selectedIds.length}
      onClick={() =>
        setSelectedIds((prev) =>
          prev.length === shapedData.length ? [] : shapedData.map((r) => r.id)
        )
      }
    />
  );

  const getBulkActionElements = () => {
    let actions = [];

    bulkActions.forEach((action) => {
      if (selectedIds.length > 0 && !action.isSingle) {
        actions.push(
          <Button
            key={action.name}
            onClick={() => {
              setModalContent(
                <action.Component
                  close={closeModal}
                  reloadTable={reloadTable}
                  onActionComplete={onActionComplete}
                  ids={selectedIds}
                  {...action.componentProps}
                />
              );
            }}
          >
            {action.name}
          </Button>
        );
      }

      if (selectedIds.length === 1 && action.isSingle) {
        actions.push(
          <Button
            key={action.name}
            onClick={() => {
              setModalContent(
                <action.Component
                  close={closeModal}
                  reloadTable={reloadTable}
                  onActionComplete={onActionComplete}
                  id={selectedIds[0]}
                  row={
                    shapedData?.find((item) => item.id === selectedIds[0]) ||
                    null
                  }
                  {...action.componentProps}
                />
              );
            }}
          >
            {action.name}
          </Button>
        );
      }
    });

    return actions.length > 0 ? actions : null;
  };

  const deleteElement = (item) => {
    return (
      <DeleteIcon
        onClick={() => {
          setModalContent(
            <DeleteItemModal
              closeModal={closeModal}
              item={item}
              deleteMessage={deleteMessage}
              onComplete={() => {
                setSkip(0);
                reloadTable();
                closeModal();
                onActionComplete();
              }}
              deleteUrl={deleteUrl}
            />
          );
        }}
      />
    );
  };

  const handleAccept = (item) => {
    return (
      <button
        onClick={() => {
          callAxios({
            method: "PUT",
            url: `brandRequests/${item.id}`,
            data: {
              isAccepted: true,
            },
          }).then(() => reloadTable());
        }}
        style={{
          width: "100px",
          height: "20px",
          background: "transparent",
          border: "none",
          color: "red",
        }}
      >
        Accept
      </button>
    );
  };

  const pinElement = (item) => {
    return (
      pinUrl &&
      (item.isPinned ? (
        <PinnedIcon onClick={() => onPin(item)} />
      ) : (
        <PinIcon onClick={() => onPin(item)} />
      ))
    );
  };

  const listViewComponent = (
    <RowFlex responsive>
      {sortOptions.length > 0 && (
        <Formik initialValues={{ sort }}>
          <div style={{ width: "200px" }}>
            <Field
              component={Dropdown}
              options={sortOptions}
              name="sort"
              placeholder="Sort By"
              fieldOnly
              onChange={(v) => {
                localStorage.setItem("sort" + header, v);
                setSort(v);
                setSkip(0);
              }}
            />
          </div>
        </Formik>
      )}
      {lvc}
    </RowFlex>
  );

  return (
    <Container dataGrid={dataGrid}>
      {!noHeader && (
        <TopBar>
          <h1>{header}</h1>
          <RowFlex responsive>
            {getBulkActionElements()}
            <HeaderComponent filters={makeFilters(filters)} />
            {listViewComponent}
            {hasAction && (
              <Fragment>
                {additionalActions}
                {actionModal ? (
                  <div>
                    <Button
                      onClick={() => {
                        setModalContent(
                          <ActionComponent
                            {...actionComponentProps}
                            close={closeModal}
                            reloadTable={reloadTable}
                            onActionComplete={onActionComplete}
                          />
                        );
                      }}
                    >
                      {actionName}
                    </Button>
                  </div>
                ) : actionLink ? (
                  <Link to={actionLink}>
                    <Button>{actionName}</Button>
                  </Link>
                ) : null}
              </Fragment>
            )}
          </RowFlex>
        </TopBar>
      )}
      {noHeader && hasBulkActions ? (
        <div
          style={{
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: "auto 1fr auto auto",
            gridGap: "0.5rem",
          }}
        >
          {bulkActionsElementForGrid || <div />}
          {filterElement}
          {listViewComponent}
          <RowFlex>{getBulkActionElements()}</RowFlex>
        </div>
      ) : (
        <Fragment>
          {filterElement}
          {noHeader && listViewComponent}
          {bulkActionsElementForGrid}
        </Fragment>
      )}

      <TableContainer height={dataGrid ? "75vh" : height}>
        <View
          tableName={tableName}
          additionalLinkParams={additionalLinkParams}
          darker={darker}
          dataGrid={dataGrid}
          deleteElement={deleteElement}
          deleteUrl={deleteUrl}
          pinElement={pinElement}
          pinUrl={pinUrl}
          selectedStatus={selectedStatus}
          gridColumns={gridColumns}
          gridConfig={gridConfig}
          gridHeaderComponentFunction={gridHeaderComponentFunction}
          gridHeadingFunction={gridHeadingFunction}
          hasBulkActions={hasBulkActions}
          linkParam={linkParam}
          loading={loading}
          navLinks={navLinks}
          actionLinks={actionLinks}
          onActionComplete={onActionComplete}
          reloadTable={reloadTable}
          response={response}
          searchParams={searchParams}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          defaultAction={defaultAction}
          shapedData={shapedData}
          tableConfig={tableConfig}
          handleAccept={handleAccept}
          to={to}
          currentSkip={skip}
          currentLimit={limit}
          currentFilters={filters}
        />
      </TableContainer>
      {!dataGrid && paginationComponent}
    </Container>
  );
};

export { TableView, Table };
