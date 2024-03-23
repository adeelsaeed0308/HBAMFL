import {
  allBrandRequestStatuses,
  baseURL,
  brandRequestStatusObject,
  Button,
  DropdownButton,
  generateLinkWithParams,
  getSourcingStatusList,
  ItemSplitter,
  Link,
  linkPlaceholders,
  navLinks,
  routing,
  Tab,
  TabContainer,
  TabDisplay,
  TableView,
  Tabs,
  TopBar,
  useAxios,
  useBrandRequests,
  useCategories,
  useLoginContext,
  useVendorRequestsStatusChanges,
  useVendorRequestsStatusChangesNDaysNoChange,
  useVendors,
} from "common";
import React, { useEffect } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Container } from "./styles";
import { format } from "date-fns";

const DASHBOARD = "DASHBOARD";
const thirtyDaysNoChange = "thirtyDaysNoChange";
const sixtyDaysNoChange = "sixtyDaysNoChange";

const Reports = () => {
  const [p] = useSearchParams();
  const selectedTab = p.get("tab");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { statusChanges, refetch: refetchStatusChanges } =
    useVendorRequestsStatusChanges();
  const { records: thirtyDaysNoChangeRecords } =
    useVendorRequestsStatusChangesNDaysNoChange(30);
  const { records: sixtyDaysNoChangeRecords } =
    useVendorRequestsStatusChangesNDaysNoChange(60);
  const {
    response,
    callAxios,
    loading: axiosLoading,
    setResponse,
  } = useAxios();

  const isDashboard = selectedTab === DASHBOARD;
  const isThirtyDaysNoChange = selectedTab === thirtyDaysNoChange;
  const isSixtyDaysNoChange = selectedTab === sixtyDaysNoChange;

  const navigateTo = (tab = DASHBOARD) => {
    navigate({ pathname, search: `?${createSearchParams({ tab })}` });
  };

  if (!selectedTab) {
    navigateTo();
  }

  const renderTable = () => {
    if (isDashboard) {
      return (
        <TableView
          url="/vendorRequests/all/statusChanges"
          selectedStatus={selectedTab}
          defaultFilters={{ selectedTab }}
          to={routing.brandRequests.view}
          linkParam={linkPlaceholders.brandRequestId}
          tableConfig={[
            {
              name: "description",
              header: "Description",
              center: true,
            },
          ]}
          header="Dashboard"
          darker
          actionLinks={[
            {
              name: "Mark As Reviewed",
              action: (e, d, reloadTable) => {
                e.preventDefault();
                callAxios({
                  method: "PUT",
                  url: `/vendorRequests/${d._id}/statusChanges/${d.statusChanges._id}`,
                  data: {
                    isReviewed: true,
                  },
                }).then(() => {
                  reloadTable();
                  refetchStatusChanges();
                });
              },
            },
          ]}
          height="55vh"
          shapeData={(res) =>
            res.data.data.map((d) => ({
              ...d,
              id: d?.brandRequest?._id,
              description: (
                <div>
                  On{" "}
                  <b>
                    {format(
                      new Date(d.statusChanges?.timestamp),
                      "hh:mm a MMM dd, yyyy"
                    )}
                  </b>
                  , brand: <b>{d?.brandRequest?.brandName}</b> was changed from{" "}
                  <b>{d.statusChanges.previousStatus}</b> to{" "}
                  <b>{d.statusChanges.status}</b>.
                </div>
              ),
            }))
          }
        />
      );
    }

    if (isThirtyDaysNoChange) {
      return (
        <TableView
          url="/vendorRequests/all/statusChanges/nDaysNoChange/30"
          selectedStatus={selectedTab}
          defaultFilters={{ selectedTab }}
          to={routing.brandRequests.view}
          linkParam={linkPlaceholders.brandRequestId}
          tableConfig={[
            {
              name: "brandName_v2",
              header: "Brand Name",
            },
            {
              name: "category_v2",
              header: "Category",
            },
            {
              name: "status_v2",
              header: "Status",
            },
          ]}
          header="Thirty Days No Change"
          darker
          height="55vh"
          shapeData={(res) =>
            res.data.data.map((d) => ({
              ...d,
              id: d?.brandRequest?._id,
              brandName_v2: d?.brandRequest?.brandName,
              category_v2: d?.brandRequest?.category?.name,
              status_v2: d?.status,
            }))
          }
        />
      );
    }

    if (isSixtyDaysNoChange) {
      return (
        <TableView
          url="/vendorRequests/all/statusChanges/nDaysNoChange/60"
          selectedStatus={selectedTab}
          defaultFilters={{ selectedTab }}
          to={routing.brandRequests.view}
          linkParam={linkPlaceholders.brandRequestId}
          tableConfig={[
            {
              name: "brandName_v3",
              header: "Brand Name",
            },
            {
              name: "category_v3",
              header: "Category",
            },
            {
              name: "status_v3",
              header: "Status",
            },
          ]}
          header="Sixty Days No Change"
          darker
          height="55vh"
          shapeData={(res) =>
            res.data.data.map((d) => ({
              ...d,
              id: d?.brandRequest?._id,
              brandName_v3: d?.brandRequest?.brandName,
              category_v3: d?.brandRequest?.category?.name,
              status_v3: d?.status,
            }))
          }
        />
      );
    }

    return <></>;
  };
  return (
    <Container>
      <TopBar>
        <h1>Reports</h1>
      </TopBar>
      <TabContainer>
        <Tabs>
          <Tab isActive={isDashboard} onClick={() => navigateTo(DASHBOARD)}>
            Dashboard
            <sup>{statusChanges?.length || 0}</sup>
          </Tab>
          <Tab
            isActive={isThirtyDaysNoChange}
            onClick={() => navigateTo(thirtyDaysNoChange)}
          >
            30-Day No Change
            <sup>{thirtyDaysNoChangeRecords?.length || 0}</sup>
          </Tab>
          <Tab
            isActive={isSixtyDaysNoChange}
            onClick={() => navigateTo(sixtyDaysNoChange)}
          >
            60-Day No Change
            <sup>{sixtyDaysNoChangeRecords?.length || 0}</sup>
          </Tab>
        </Tabs>
        <TabDisplay>{renderTable()}</TabDisplay>
      </TabContainer>
    </Container>
  );
};

export default Reports;
