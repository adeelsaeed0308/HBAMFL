import { DataGrid } from "@mui/x-data-grid";
import Toggle from "common/components/Toggle";
import { generateLinkWithParams } from "common/config";
import { useModalContext } from "common/context";
import { Link } from "common/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Spinner from "../../Spinner";
import { renderElement } from "../functions";
import { BulkAction, iconObject } from "../styles";
import { Table } from "./styles";
import { Button } from "@mui/material";
import { fetchImage } from "common/functions";

const List = ({
  tableName = "",
  additionalLinkParams = {},
  darker = false,
  dataGrid,
  deleteElement,
  handleAccept,
  deleteUrl,
  pinElement,
  pinUrl,
  hasBulkActions,
  linkParam,
  loading,
  navLinks = [],
  actionLinks = [],
  onActionComplete = () => {},
  reloadTable,
  response,
  searchParams = "",
  selectedIds = [],
  setSelectedIds,
  shapedData = [],
  tableConfig = [],
  to = "",
  selectedStatus,
  currentSkip,
  currentLimit,
  currentFilters,
}) => {
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModalContext();

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortData = () => {
    const sortedData = [...shapedData];

    if (sortBy) {
      sortedData.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedData;
  };

  const getFilesHeader = (
    row,
    name,
    action,
    deleteFile,
    uploadFile,
    reloadTable,
    isVendorPriceSheet,
    brandId
  ) => {
    let data = row[name];
    if (isVendorPriceSheet) {
      data =
        row[name].length === 0
          ? []
          : row[name].find((priceSheet) => priceSheet.brand === brandId)
              ?.attachments || [];
    }
    return data.length ? (
      <div style={{ display: "flex", gap: 10 }}>
        {data.map((item) => (
          <Link
            to={fetchImage(item.substring(item.lastIndexOf(",")))}
            rel="noreferrer"
            target={"_blank"}
          >
            {item.substring(item.lastIndexOf("_") + 1)}
          </Link>
        ))}

        {deleteFile && (
          <p
            onClick={() =>
              deleteFile({
                id: row._id,
                filename: data?.[0],
                reloadTable,
              })
            }
            style={{ cursor: "pointer" }}
          >
            X
          </p>
        )}
      </div>
    ) : (
      uploadFile && (
        <input
          type="file"
          onChange={(e) => {
            e.id = row._id;
            e.reloadTable = reloadTable;
            uploadFile(e);
          }}
        />
      )
    );
  };

  if (dataGrid) {
    const gridTableConfig = [
      ...tableConfig,
      ...actionLinks.map((actionLink) => ({
        name: actionLink.name,
        header: "",
        width: 20,
        render: (_, params) => {
          return (
            <Link to="#" onClick={actionLink.action}>
              {actionLink.name}
            </Link>
          );
        },
      })),
      ...navLinks.map((navLink) => ({
        name: navLink.name,
        header: "",
        width: 20,
        noTo: true,
        render: (_, params) => {
          return (
            <Link to={`${navLink.link(params)}${searchParams}`}>
              {navLink.name}
            </Link>
          );
        },
      })),
      ...(deleteUrl
        ? [
            {
              name: "deleteAction",
              header: "",
              sortable: false,
              render: deleteElement,
              noTo: true,
              width: 20,
            },
          ]
        : []),
      ...("pinUrl"
        ? [
            {
              name: "pinAction",
              header: "",
              sortable: false,
              render: pinElement,
              noTo: true,
              width: 20,
            },
          ]
        : []),
      // {
      //   name: "handleAccept",
      //   header: "",
      //   sortable: false,
      //   render: pinElement,
      //   noTo: true,
      //   width: 20,
      // },
    ];

    return (
      <DataGrid
        loading={loading}
        columns={gridTableConfig.map((tc) => ({
          field: tc.name,
          headerName: tc.header,
          description: tc.header,
          width: tc.width || 100,
          renderCell: ({ value, row }) => {
            const params = { [linkParam]: row.id, ...additionalLinkParams };
            const val =
              tc.render?.(row, params) || renderElement({ value, ...tc });
            return to && !tc.noTo ? (
              <Link to={generateLinkWithParams(to, params)}>{val}</Link>
            ) : (
              val
            );
          },
          sortable: tc.sortable ?? true,
          filterable: tc.sortable ?? true,
          hideable: false,
        }))}
        rows={shapedData}
        style={{ height: "100%" }}
      />
    );
  }

  return (
    <Table darker={darker}>
      <thead>
        <tr>
          {hasBulkActions && response && (
            <th>
              <BulkAction
                checked={shapedData.length === selectedIds.length}
                onClick={() =>
                  setSelectedIds((prev) =>
                    prev.length === shapedData.length
                      ? []
                      : shapedData.map((r) => r.id)
                  )
                }
              />
            </th>
          )}
          {pinUrl && <th />}
          {tableConfig.map(({ name, header: tHeader, center, width }) => (
            <th
              key={name}
              style={{ textAlign: center && "center", width }}
              onClick={() => {
                if (sortBy === name) {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy(name);
                  setSortOrder("asc");
                }
              }}
            >
              {tHeader} {sortBy === name && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
          ))}
          {navLinks.map((l) => (
            <th key={l.name} />
          ))}
          {actionLinks.map((a) => (
            <th key={a.name} />
          ))}
          {deleteUrl && <th />}
          {/* {(<th style={{ width: "3%", textAlign: "center" }}>Accept</th>)} */}
          {selectedStatus === "VendorCreated" && (
            <th style={{ width: "3%", textAlign: "center" }}>Accept</th>
          )}
        </tr>
      </thead>
      <tbody>
        {response ? (
          sortData().map((row, index) => {
            const params = { [linkParam]: row.id, ...additionalLinkParams };
            return (
              <tr
                key={row.id}
                id={row.id}
                className={
                  sessionStorage.getItem(`${tableName}-selectedItemId`) ===
                  row.id
                    ? "selected"
                    : ""
                }
              >
                {hasBulkActions && (
                  <td id={`${row.id}-checkbox`}>
                    <BulkAction
                      checked={selectedIds.includes(row.id)}
                      onClick={() => {
                        setSelectedIds((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((i) => i !== row.id)
                            : [...prev, row.id]
                        );
                      }}
                    />
                  </td>
                )}
                {pinUrl && <td style={{ width: "3%" }}>{pinElement(row)}</td>}
                {tableConfig.map(
                  ({
                    name,
                    order,
                    isDropdown,
                    options = [],
                    onChange = () => {},
                    loading: dropdownLoading,
                    noTo = false,
                    type,
                    icon,
                    Component = () => <div>LOL</div>,
                    componentProps = {},
                    center,
                    header,
                    action = null,
                    accessor = null,
                    defaultVendorId = null,
                    uploadFile = null,
                    handleAccept,
                    deleteFile = null,
                    isVendorPriceSheet = false,
                    brandId = null,
                    _id,
                    ...rest
                  }) => {
                    const value =
                      header === "Files" ? (
                        getFilesHeader(
                          row,
                          name,
                          action,
                          deleteFile,
                          uploadFile,
                          reloadTable,
                          isVendorPriceSheet,
                          brandId
                        )
                      ) : header === "Default" ? (
                        <Toggle
                          fit
                          checked={defaultVendorId === row._id}
                          onChange={() => {
                            if (action) {
                              action(row._id);
                            }
                          }}
                        />
                      ) : header === "Main" && isVendorPriceSheet ? (
                        defaultVendorId === row.id ? (
                          "Main Vendor"
                        ) : (
                          ""
                        )
                      ) : (
                        row[name]
                      );
                    const styleProps = { textAlign: center && "center" };
                    const tdPropsIfLink =
                      to && !noTo
                        ? {
                            style: { cursor: "pointer", ...styleProps },
                            onClick: () => {
                              if (to) {
                                if (tableName) {
                                  sessionStorage.setItem(
                                    `${tableName}-skip`,
                                    currentSkip
                                  );
                                  sessionStorage.setItem(
                                    `${tableName}-limit`,
                                    currentLimit
                                  );
                                  sessionStorage.setItem(
                                    `${tableName}-selectedItemId`,
                                    row.id
                                  );
                                  sessionStorage.setItem(
                                    `${tableName}-filters`,
                                    JSON.stringify(currentFilters) ?? null
                                  );
                                }
                                navigate(generateLinkWithParams(to, params));
                              }
                            },
                          }
                        : action
                        ? {
                            style: { cursor: "pointer", ...styleProps },
                            // onClick: () => {
                            //   if (
                            //     action &&
                            //     header === "Files" &&
                            //     row[name].length
                            //   ) {
                            //     action();
                            //   }
                            // },
                          }
                        : {};

                    if (isDropdown) {
                      return (
                        <td
                          key={name}
                          style={{ width: "250px", ...styleProps }}
                        >
                          {dropdownLoading ? (
                            <Spinner inline />
                          ) : (
                            <Select
                              defaultValue={options.find(
                                (o) => o.value === value
                              )}
                              options={options}
                              onChange={(first) => {
                                onChange(row, first.value, reloadTable);
                              }}
                            />
                          )}
                        </td>
                      );
                    }

                    if (type === "modal") {
                      const Icon = iconObject[icon];
                      return (
                        <td key={name} style={{ width: "1%", ...styleProps }}>
                          <Icon
                            onClick={() => {
                              setModalContent(
                                <Component
                                  row={row}
                                  close={closeModal}
                                  reloadTable={reloadTable}
                                  onActionComplete={onActionComplete}
                                  {...(typeof componentProps === "function"
                                    ? componentProps(row)
                                    : componentProps)}
                                />
                              );
                            }}
                          />
                        </td>
                      );
                    }
                    if (
                      header === "Main" &&
                      isVendorPriceSheet &&
                      defaultVendorId !== row.id &&
                      action
                    ) {
                      return (
                        <td key={name}>
                          <input
                            type="button"
                            value={"Set as Main"}
                            onClick={() => {
                              action(row.id, brandId, reloadTable);
                            }}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={name} {...tdPropsIfLink} style={styleProps}>
                        {renderElement({
                          value,
                          ...rest,
                        })}
                      </td>
                    );
                  }
                )}
                {navLinks.map((navLink) => {
                  return (
                    <td
                      key={navLink.name}
                      style={{ width: "4%", fontSize: "1rem" }}
                    >
                      <Link to={`${navLink.link(params)}${searchParams}`}>
                        {navLink.name}
                      </Link>
                    </td>
                  );
                })}
                {actionLinks.map((actionLink) => {
                  return (
                    <td
                      key={actionLink.name}
                      style={{ width: "10%", fontSize: "1rem" }}
                    >
                      <Link
                        to="#"
                        onClick={(e) => {
                          actionLink.action(e, row, reloadTable);
                        }}
                      >
                        {actionLink.name}
                      </Link>
                    </td>
                  );
                })}
                {deleteUrl && (
                  <td style={{ width: "3%" }}>{deleteElement(row)}</td>
                )}
                {/* {<td style={{ width: "3%" }}>{handleAccept(row)}</td>} */}
                {selectedStatus === "VendorCreated" && (
                  <td style={{ width: "3%" }}>{handleAccept(row)}</td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td>
              <Spinner inline />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export { List, Table };
