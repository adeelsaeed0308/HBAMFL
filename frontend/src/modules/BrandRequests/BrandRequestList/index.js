import {
  allBrandRequestStatuses,
  baseURL,
  brandRequestStatusObject,
  Button,
  DropdownButton,
  generateLinkWithParams,
  getSourcingStatusList,
  htmlToPlainText,
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
  TextStyledLink,
  TopBar,
  useAxios,
  useBrandRequests,
  useCategories,
  useLoginContext,
  useModalContext,
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
import StatusChangeForm from "./StatusChangeForm";
import { Container, VendorField } from "./styles";
import VendorAddForm from "./VendorAddForm";
import UpdateFollowUpDate from "./UpdateFollowUpDate";
import SentEmailsDetail from "../SentEmailsDetail";

const ALL = "ALL";
const UNWORKED = "UNWORKED";
const allStatuses = allBrandRequestStatuses;
allStatuses.pop();

const allUnworkedStatuses = [
  brandRequestStatusObject.Unworked.value,
  brandRequestStatusObject.NoneAvailability.value,
];

const downloadExport = (status) => {
  const a = document.createElement("a");
  a.target = "_blank";
  a.href = `${baseURL}/brandRequests/export?status=${status}`;
  a.click();
  a.remove();
};

const BrandRequestList = () => {
  const [p] = useSearchParams();
  const selectedStatus = p.get("status");
  const isPinnedSelected = p.get("pinned");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { brandRequests, refetch, loading } = useBrandRequests();
  const { isSourcingAdmin } = useLoginContext();
  const adminProps = isSourcingAdmin
    ? {
        deleteUrl: (id) => `/brandRequests/${id}`,
        deleteMessage: (br) => `Delete ${br.brandName}`,
        pinUrl: (id) => `/brandRequests/pin/${id}`,
      }
    : {};
  const { categories } = useCategories();
  const vendors = useVendors();
  const { setModalContent, closeModal } = useModalContext();

  useEffect(() => {
    sessionStorage.setItem("lastSelectedBrandRequestsTable", selectedStatus);
  }, [selectedStatus]);

  const statuses = getSourcingStatusList(brandRequests);
  const isAll = selectedStatus === ALL;
  const isUnworked = selectedStatus === UNWORKED;
  const isFollowUp = selectedStatus === brandRequestStatusObject.FollowUp.value;

  const defaultStatusFilters = {
    statuses: isAll
      ? { $in: allStatuses }
      : isUnworked
      ? { $in: allUnworkedStatuses }
      : selectedStatus,
  };

  const defaultPinnedFilters = {
    isPinned: true,
    statuses: { $in: allStatuses },
  };
  const defaultFilters = isPinnedSelected
    ? defaultPinnedFilters
    : defaultStatusFilters;

  // console.log('defaultFilters ===>', defaultFilters);
  // console.log('isPinnedSelected ===>', isPinnedSelected);
  // console.log('defaultPinnedFilters ===>', defaultPinnedFilters);

  const filterConfig = [
    {
      name: "brandName",
      type: "input",
      label: "Search",
    },
    {
      name: "category",
      type: "dropdown",
      options: categories,
      label: "Filter By Category",
    },
    {
      name: "vendor",
      type: "dropdown",
      options: vendors,
      label: "Filter By Vendor",
    },
  ];

  const exportOptions = [
    <div onMouseDown={() => downloadExport("AllWorkedOn")}>All Worked On</div>,
    ...statuses.map(({ value, label }) => {
      return (
        <div key={value} onMouseDown={() => downloadExport(value)}>
          {label}
        </div>
      );
    }),
  ];

  const navigateTo = (status = ALL) => {
    navigate({ pathname, search: `?${createSearchParams({ status })}` });
  };

  const navigateToPinned = () => {
    navigate({
      pathname,
      search: `?${createSearchParams({ status: ALL, pinned: 1 })}`,
    });
  };

  if (!selectedStatus) {
    navigateTo();
  }

  const renderTable = () => {
    return (
      <TableView
        tableName="brandRequestList"
        selectView
        selectedStatus={selectedStatus}
        to={routing.brandRequests.view}
        bulkActions={[
          { name: "Assign Vendors", Component: VendorAddForm },
          { name: "Change Status", Component: StatusChangeForm },
          {
            name: "Move Follow Up Date",
            Component: UpdateFollowUpDate,
            componentProps: { refetch },
            isSingle: true,
          },
        ]}
        url="/brandRequests"
        tableConfig={[
          {
            name: "brandName",
            header: "Brand Name",
          },
          {
            name: "category",
            header: "Category",
          },
          {
            name: "requestedByCustomer",
            header: "Customer",
          },
          ...(isAll || isUnworked
            ? [{ name: "statuses", header: "Statuses" }]
            : []),
          {
            name: "requestBy",
            header: "Requested By",
          },
          {
            name: "createdAt",
            header: "Requested Date",
            isDate: true,
          },
          {
            name: "lastEmail",
            header: "Last Email",
            width: "300px",
          },
          ...(isFollowUp
            ? [
                {
                  name: "followUpDate",
                  header: "Follow Up Date",
                  isDate: true,
                },
              ]
            : []),
          {
            name: "vendors",
            header: "Assigned To",
            noTo: true,
          },
        ]}
        filterConfig={filterConfig}
        darker
        navLinks={navLinks.brandRequests(isSourcingAdmin)}
        linkParam={linkPlaceholders.brandRequestId}
        noHeader
        onActionComplete={refetch}
        {...adminProps}
        height="55vh"
        defaultParams={{
          populate: JSON.stringify([
            { path: "user" },
            { path: "category" },
            {
              path: "vendorRequests",
              populate: "vendor sentEmails.contacts",
            },
          ]),
        }}
        defaultFilters={defaultFilters}
        shapeData={(res) =>
          res.data.data.map((d) => ({
            ...d,
            requestBy: d.user?.name || d.requestBy,
            category: d.category?.name,
            statuses: d.statuses
              .map((status) => brandRequestStatusObject[status].label)
              .join(", "),
            vendors: d.vendorRequests.map((v) => (
              <Link
                to={generateLinkWithParams(routing.vendors.view, {
                  [linkPlaceholders.vendorId]: v.vendor.id,
                })}
              >
                <VendorField>{v.vendor.name}</VendorField>
              </Link>
            )),
            lastEmail: d?.vendorRequests.map((vendorRequest) => (
              <div style={{ marginBottom: "5px" }}>
                {vendorRequest?.sentEmails?.length !== 0 ? (
                  <>
                    <p>
                      <b>{vendorRequest.vendor.name}</b>
                    </p>
                    <p className="truncate">
                      <b>
                        {
                          vendorRequest.sentEmails[
                            vendorRequest.sentEmails.length - 1
                          ].subject
                        }
                        :
                      </b>{" "}
                      {htmlToPlainText(
                        vendorRequest.sentEmails[
                          vendorRequest.sentEmails.length - 1
                        ].body
                      )}
                    </p>
                    <TextStyledLink
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalContent(
                          <SentEmailsDetail
                            vendor={vendorRequest.vendor}
                            sentEmails={vendorRequest.sentEmails}
                          />
                        );
                      }}
                    >
                      View More
                    </TextStyledLink>
                  </>
                ) : null}
              </div>
            )),
          }))
        }
        initialSkip={
          sessionStorage.getItem("lastSelectedBrandRequestsTable") ===
          selectedStatus
            ? Number(sessionStorage.getItem("brandRequestList-skip") || 0)
            : 0
        }
        initialLimit={
          sessionStorage.getItem("lastSelectedBrandRequestsTable") ===
          selectedStatus
            ? Number(sessionStorage.getItem("brandRequestList-limit") || 10)
            : 10
        }
        initialFilters={
          sessionStorage.getItem("lastSelectedBrandRequestsTable") ===
          selectedStatus
            ? JSON.parse(sessionStorage.getItem("brandRequestList-filters")) ??
              null
            : null
        }
      />
    );
  };

  return (
    <Container>
      <TopBar>
        <h1>Brands</h1>
        <div>
          <ItemSplitter style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <DropdownButton secondary options={exportOptions}>
              Export Report
            </DropdownButton>
            <Link to={routing.brandRequests.add}>
              <Button>Request A Brand</Button>
            </Link>
            <Link to={routing.brandRequests.bulkImport}>
              <Button>Bulk Import</Button>
            </Link>
          </ItemSplitter>
        </div>
      </TopBar>
      <TabContainer>
        <Tabs>
          {/* <Tab
            isActive={isDashboard && !isPinnedSelected}
            onClick={() => navigateTo(DASHBOARD)}
          >
            Dashboard
            <sup>{statusChanges?.length || 0}</sup>
          </Tab>
          <Tab
            isActive={isThirtyDaysNoChange && !isPinnedSelected}
            onClick={() => navigateTo(thirtyDaysNoChange)}
          >
            30-Day No Change
            <sup>{thirtyDaysNoChangeRecords?.length || 0}</sup>
          </Tab>
          <Tab
            isActive={isSixtyDaysNoChange && !isPinnedSelected}
            onClick={() => navigateTo(sixtyDaysNoChange)}
          >
            60-Day No Change
            <sup>{sixtyDaysNoChangeRecords?.length || 0}</sup>
          </Tab> */}
          <Tab
            isActive={isAll && !isPinnedSelected}
            onClick={() => navigateTo(ALL)}
          >
            All Working On
            <sup>
              {loading
                ? "..."
                : Object.keys(
                    statuses.reduce(
                      (acc, { ids, value }) => ({
                        ...acc,
                        ...(allStatuses.includes(value) ? ids : {}),
                      }),
                      {}
                    )
                  ).length}
            </sup>
          </Tab>
          <Tab
            isActive={isUnworked && !isPinnedSelected}
            onClick={() => navigateTo(UNWORKED)}
          >
            Unworked
            <sup>
              {loading
                ? "..."
                : Object.keys(
                    statuses.reduce(
                      (acc, { ids, value }) => ({
                        ...acc,
                        ...(allUnworkedStatuses.includes(value) ? ids : {}),
                      }),
                      {}
                    )
                  ).length}
            </sup>
          </Tab>
          {statuses
            .filter(
              ({ value }) =>
                ![brandRequestStatusObject.Unworked.value].includes(value)
            )
            .map(({ value, total, label }) => {
              return (
                <Tab
                  isActive={value === selectedStatus && !isPinnedSelected}
                  onClick={() => navigateTo(value)}
                >
                  {label}
                  <sup>{loading ? "..." : total}</sup>
                </Tab>
              );
            })}
          <Tab isActive={isPinnedSelected} onClick={navigateToPinned}>
            Pinned
            <sup>
              {loading
                ? "..."
                : brandRequests.filter((br) => br.isPinned === true).length}
            </sup>
          </Tab>
        </Tabs>
        <TabDisplay>{renderTable()}</TabDisplay>
      </TabContainer>
    </Container>
  );
};

export default BrandRequestList;
