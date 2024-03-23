import {
  Button,
  generateLinkWithParams,
  getSourcingStatusList,
  Link,
  linkPlaceholders,
  routing,
  TableView,
  useAxios,
  useBrandRequests,
  useLoginContext,
  useToast,
  useVendors,
} from "common";
import React, { useState } from "react";
import BulkStatusChange from "../ViewBrandRequest/BulkStatusChange";
import VendorEmailForm from "./VendorEmailForm";
import { omit } from "lodash";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import { format } from "date-fns";

const defaultParams = {
  populate: "vendorData brandRequest user",
};

const VendorRequestList = () => {
  const { isSourcingAdmin } = useLoginContext();
  const { alertSuccess } = useToast();
  const { callAxios, loading } = useAxios();
  const vendors = useVendors();
  const { brandRequests } = useBrandRequests();
  const adminProps = isSourcingAdmin
    ? {
        deleteUrl: (vrId) => `vendorRequests/${vrId}`,
      }
    : {};

  const [tableFilters, setTableFilters] = useState({});

  const filterConfig = [
    {
      name: "vendor",
      type: "dropdown",
      options: vendors,
      label: "Filter By Vendor",
    },
    {
      name: "brandRequest",
      type: "dropdown",
      options: brandRequests,
      label: "Filter By Brand",
    },
    {
      name: "status",
      type: "dropdown",
      options: getSourcingStatusList(),
      label: "Filter By Status",
    },
  ];

  const ExportButton = () => {
    return (
      <Button
        loading={loading}
        onClick={() => {
          callAxios({
            url: "/vendorRequests",
            method: "GET",
            params: {
              limit: 10000000,
              skip: 0,
              sort: "-createdAt",
              filters: tableFilters,
              ...omit(defaultParams, ["filters"]),
            },
          }).then((response) => {
            const header = [
              "Brand",
              "Vendor",
              "Country",
              "Requested By",
              "Status",
              "Last Updated",
            ];
            const body = [];
            response?.data?.data?.map((item) =>
              body.push([
                item?.brandRequest?.brandName || "--------",
                item?.vendorData?.name || "--------",
                item?.vendorData?.country || "--------",
                item?.user?.name || "--------",
                item?.status || "--------",

                item?.statusChanges?.length > 0
                  ? format(
                      new Date(
                        item?.statusChanges[
                          item?.statusChanges?.length - 1
                        ]?.timestamp
                      ),
                      "MMM dd, yyyy"
                    )
                  : "--------",
              ])
            );
            // Create a workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sample Data");

            worksheet.addRow(header);
            worksheet.addRows(body);

            // Generate the Excel file and trigger download
            workbook.xlsx.writeBuffer().then((buffer) => {
              saveAs(
                new Blob([buffer], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
                "vendor_requests.xlsx"
              );
            });
          });
        }}
      >
        Export
      </Button>
    );
  };

  return (
    <TableView
      url="/vendorRequests"
      tableConfig={[
        {
          name: "brand",
          header: "Brand",
        },
        {
          name: "vendor",
          header: "Vendor",
        },
        {
          name: "country",
          header: "Country",
        },
        {
          name: "user",
          header: "Requested By",
        },
        {
          name: "status",
          header: "Status",
          isDropdown: isSourcingAdmin,
          options: getSourcingStatusList(),
          onChange: (row, status, reloadTable) => {
            callAxios({
              method: "PUT",
              url: `/vendorRequests/${row.id}`,
              data: { status },
            }).then(() => {
              alertSuccess("Status Updated!");
              reloadTable();
            });
          },
          loading,
        },
        {
          name: "lastUpdate",
          header: "Last Updated",
          isDate: true,
        },
      ]}
      additionalActions={[<ExportButton key="exportButton" />]}
      header="All Vendor Requests"
      filterConfig={filterConfig}
      {...adminProps}
      defaultParams={defaultParams}
      bulkActions={[
        { name: "Change Status", Component: BulkStatusChange },
        { name: "Email Vendors", Component: VendorEmailForm },
      ]}
      shapeData={(d) => {
        return d.data.data
          .filter((d) => d.brandRequest)
          .map((request) => {
            return {
              ...request,
              brand: (
                <Link
                  to={generateLinkWithParams(routing.brandRequests.view, {
                    [linkPlaceholders.brandRequestId]: request.brandRequest.id,
                  })}
                >
                  {request.brandRequest.brandName}
                </Link>
              ),
              vendor: (
                <Link
                  to={generateLinkWithParams(routing.vendors.view, {
                    [linkPlaceholders.vendorId]: request.vendorData.id,
                  })}
                >
                  {request.vendorData.name}
                </Link>
              ),
              country: request.vendorData.country,
              user: request.user?.name,
              lastUpdate:
                request?.statusChanges?.length > 0
                  ? request?.statusChanges[request?.statusChanges?.length - 1]
                      ?.timestamp
                  : null,
            };
          });
      }}
      sendFiltersToParent={setTableFilters}
    />
  );
};

export default VendorRequestList;
