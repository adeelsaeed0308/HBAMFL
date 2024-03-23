import { CheckboxChecked, View } from "@carbon/icons-react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  brandRequestStatusObject,
  Button,
  generateLinkWithParams,
  getApiPath,
  getButtonStyleForVendorBrandRequestStatus,
  Link,
  linkPlaceholders,
  openNewTab,
  PageContainer,
  routing,
  Spinner,
  Tab,
  TabContainer,
  Tabs,
  useAxios,
  useLoginContext,
  useModalContext,
} from "common";
import { orderBy } from "lodash";
import { useVendorUserVendor } from "modules/VendorUserLandingPage";
import React, { useEffect, useState } from "react";
import StatusChangeModal from "../StatusChangeModal";
import { Grid } from "@mui/material";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const openStatus = Array.of(brandRequestStatusObject.Open.value).join(",");
const orderedStatus = Array.of(brandRequestStatusObject.Ordered.value).join(
  ","
);
const closedStatus = Array.of(brandRequestStatusObject.Closed.value).join(",");
const inActiveStatus = Array.of(brandRequestStatusObject.InActive.value).join(",");

const OpenBrandList = () => {
  const [p] = useSearchParams();
  const selectedStatus = p.get("status");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { vendor, refetchVendor, vendorLoading } = useVendorUserVendor();
  const brands = vendor.vendorRequests;

  const navigateTo = (status) => {
    navigate({ pathname, search: `?${createSearchParams({ status })}` });
  };

  useEffect(() => {
    if (!selectedStatus) {
      navigateTo(openStatus);
    }
  }, [selectedStatus]);

  return (
    <PageContainer>
      <h3>Open Brands for {vendor.name}</h3>{" "}
      {vendorLoading && <Spinner inline />}
      <TabContainer>
        <Tabs>
          <Tab
            isActive={selectedStatus === openStatus}
            onClick={() => navigateTo(openStatus)}
          >
            Open
          </Tab>
          <Tab
            isActive={selectedStatus === inActiveStatus}
            onClick={() => navigateTo(inActiveStatus)}
          >
            In Active
          </Tab>
          <Tab
            isActive={selectedStatus === orderedStatus}
            onClick={() => navigateTo(orderedStatus)}
          >
            Ordered
          </Tab>
          <Tab
            isActive={selectedStatus === closedStatus}
            onClick={() => navigateTo(closedStatus)}
          >
            Closed
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

export default OpenBrandList;

const BrandsDataGrid = ({ brands, refetchVendor, vendor }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const { callAxios, loading } = useAxios({
    onComplete: () => refetchVendor(),
  });
  const { setModalContent, closeModal } = useModalContext();
  const { updateBrandRequests } = useLoginContext();

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
        `vendorRequests/${vendor.id}/open-brands/export/${
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
          field: "category",
          headerName: "Category",
          description: "Category",
          width: 200,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value}</Link>
          ),
        },
        {
          field: "openedAt",
          headerName: "Opened Date",
          description: "Date of Request",
          width: 200,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>
              {value && new Date(value).toLocaleString()}
            </Link>
          ),
        },
        {
          field: "hasPricesheet",
          headerName: "Price Sheet",
          description: "Price Sheet",
          width: 100,
          renderCell: ({ value, row }) => (
            <Link to={getTo(row.id)}>{value && <CheckboxChecked />}</Link>
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
                    isOpen
                    status={value}
                    onSubmit={(status) => {
                      closeModal();
                      callAxios({
                        method: "PUT",
                        url: `vendorRequests/${row.id}`,
                        data: { status },
                      }).then(() => updateBrandRequests(vendor?._id));
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
          field: "Edit",
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
          openedAt: new Date(
            brand.statusChanges.find((sc) => sc.status === "Open")?.timestamp
          ).toLocaleString(),
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

// Open:
// 1. open
// 2. ordered
// 3. closed
