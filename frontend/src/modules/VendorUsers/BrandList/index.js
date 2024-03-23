import { View } from "@carbon/icons-react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  allBrandRequestStatuses,
  brandRequestStatusObject,
  Button,
  generateLinkWithParams,
  getApiPath,
  getButtonStyleForVendorBrandRequestStatus,
  isRequestOpen,
  Link,
  linkPlaceholders,
  openNewTab,
  PageContainer,
  routing,
  RowFlex,
  Spinner,
  Tab,
  TabContainer,
  Tabs,
  useAxios,
  useModalContext,
} from "common";
import { orderBy } from "lodash";
import { useVendorUserVendor } from "modules/VendorUserLandingPage";
import React, { useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import StatusChangeModal from "../StatusChangeModal";
import { useEffect } from "react";
import { Grid } from "@mui/material";

const requestedAndUnWorkedStatus = Array.of(
  brandRequestStatusObject.Requested.value,
  brandRequestStatusObject.Unworked.value
).join(",");
const inProcessStatus = Array.of(brandRequestStatusObject.InProcess.value).join(
  ","
);
const deniedAndAlreadyOnMarketStatus = Array.of(
  brandRequestStatusObject.Denied.value,
  brandRequestStatusObject.AlreadyOnTheMarket.value
).join(",");
const workedOnStatus = Array.of(
  brandRequestStatusObject.WorkedOn.value,
).join(",");
const followUpStatus = Array.of(
  brandRequestStatusObject.FollowUp.value,
).join(",");

const BrandList = () => {
  const [p] = useSearchParams();
  const selectedStatus = p.get("status");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { vendor, refetchVendor, vendorLoading } = useVendorUserVendor();
  const brands = vendor.vendorRequests;

  const toAdd = () => navigate(routing.vendorUsers.addBrand);

  const navigateTo = (status) => {
    navigate({ pathname, search: `?${createSearchParams({ status })}` });
  };

  useEffect(() => {
    if (!selectedStatus) {
      navigateTo(requestedAndUnWorkedStatus);
    }
  }, [selectedStatus]);

  return (
    <PageContainer>
      <RowFlex style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>New Brands for {vendor.name}</h3>
        {vendorLoading && <Spinner inline />}
        <RowFlex style={{ display: "flex" }}>
          {/* <Link to={routing.vendorUsers.addBrand}> */}
          <Button onClick={() => toAdd()}>Create Brand</Button>
          {/* </Link> */}
        </RowFlex>
      </RowFlex>
      <TabContainer>
        <Tabs>
          <Tab
            isActive={selectedStatus === requestedAndUnWorkedStatus}
            onClick={() => navigateTo(requestedAndUnWorkedStatus)}
          >
            Requested/Un Worked
          </Tab>
          <Tab
            isActive={selectedStatus === inProcessStatus}
            onClick={() => navigateTo(inProcessStatus)}
          >
            In Process
          </Tab>
          <Tab
            isActive={selectedStatus === deniedAndAlreadyOnMarketStatus}
            onClick={() => navigateTo(deniedAndAlreadyOnMarketStatus)}
          >
            Denied/ Already On The Market
          </Tab>
          <Tab
            isActive={selectedStatus === workedOnStatus}
            onClick={() => navigateTo(workedOnStatus)}
          >
            Worked On
          </Tab>
          <Tab
            isActive={selectedStatus === followUpStatus}
            onClick={() => navigateTo(followUpStatus)}
          >
            Follow Up
          </Tab>
        </Tabs>
      </TabContainer>
      <BrandsDataGrid
        brands={
          brands?.filter((b) =>
            selectedStatus?.split(",")?.includes(b.status)
          ) || []
        }
        refetchVendor={refetchVendor}
        vendor={vendor}
      />
    </PageContainer>
  );
};

export default BrandList;

const BrandsDataGrid = ({ brands, refetchVendor, vendor }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const { callAxios, loading } = useAxios({
    onComplete: () => refetchVendor(),
  });
  const { setModalContent, closeModal } = useModalContext();
  const getTo = (vendorRequestId) =>
    generateLinkWithParams(routing.vendorUsers.viewBrand, {
      [linkPlaceholders.vendorRequestId]: vendorRequestId,
    });

  const edit = (vendorRequestId) =>
    generateLinkWithParams(routing.vendorUsers.editBrand, {
      [linkPlaceholders.vendorRequestId]: vendorRequestId,
    });

  const exportBrands = () => {
    openNewTab(
      getApiPath(
        `vendorRequests/${vendor.id}/new-brands/export/${
          selectedIds?.join(",") || "all"
        }`
      )
    );
  };

  return (
    <DataGrid
      autoHeight
      slots={{
        toolbar: () => (
          <GridToolbarContainer>
            <Grid container item xs>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
            </Grid>
            <Grid>
              <Button
                disabled={selectedIds.length === 0}
                onClick={exportBrands}
              >
                Export
              </Button>
            </Grid>
          </GridToolbarContainer>
        ),
      }}
      checkboxSelection
      columns={[
        {
          field: "brandName",
          headerName: "Brand",
          description: "Brand",
          width: 250,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value}</Link>
          ),
        },
        {
          field: "createdAt",
          headerName: "Requested Date",
          description: "Date of Request",
          width: 200,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value}</Link>
          ),
        },
        {
          field: "status",
          headerName: "Status",
          width: 200,
          renderCell: ({ value, row }) => (
            <Button
              loading={loading}
              style={getButtonStyleForVendorBrandRequestStatus(value)}
              onClick={() => {
                setModalContent(
                  <StatusChangeModal
                    status={value}
                    onSubmit={(status) => {
                      closeModal();
                      callAxios({
                        method: "PUT",
                        url: `vendorRequests/${row.id}`,
                        data: { status },
                      });
                    }}
                  />
                );
              }}
            >
              {brandRequestStatusObject[value]?.label}
            </Button>
          ),
        },
        {
          field: "category",
          headerName: "Category",
          description: "Category",
          width: 200,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value}</Link>
          ),
        },
        {
          field: "updatedAt",
          headerName: "Last Modified",
          description: "Last Modified",
          width: 250,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value}</Link>
          ),
        },
        {
          field: "view",
          headerName: "",
          description: "",
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>
              <View />
            </Link>
          ),
        },
        {
          field: "edit",
          headerName: "",
          description: "",
          renderCell: ({ value, row }) => (
            <Link to={edit(row.id)}>
              {/* <View /> */}
              Edit
            </Link>
          ),
        },
        {
          field: "delete",
          headerName: "",
          description: "",
          renderCell: ({ value, row }) => (
            <p
              style={{ cursor: "pointer" }}
              onClick={() =>
                callAxios({
                  method: "DELETE",
                  url: `/vendorRequests/${row.id}`,
                })
              }
            >
              Delete
            </p>
          ),
        },
      ]}
      rows={orderBy(
        brands.map((brand) => ({
          ...brand,
          brandName: brand.brandRequest?.brandName,
          category: brand.brandRequest?.category?.name,
          updatedAt: new Date(brand.updatedAt).toLocaleString(),
          createdAt: new Date(brand.createdAt).toLocaleString(),
        })),
        (b) => new Date(b.updatedAt),
        "desc"
      )}
      onRowSelectionModelChange={(ids) => {
        setSelectedIds(ids);
      }}
    />
  );
};
