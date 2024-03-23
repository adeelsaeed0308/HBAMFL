import {
  Attachments,
  brandRequestStatusObject,
  Button,
  Card,
  CollapsibleHeader,
  ErrorText,
  FullPageLoad,
  generateLinkWithParams,
  getSourcingStatusList,
  htmlToPlainText,
  Link,
  linkPlaceholders,
  Notes,
  routing,
  RowFlex,
  Table,
  TableView,
  TextStyledLink,
  theme,
  TopBar,
  useAxios,
  useLoginContext,
  useModalContext,
} from "common";
import { useToast } from "common/context/Toast";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useParams } from "react-router-dom";
import BulkStatusChange from "./BulkStatusChange";
import EmailVendor from "./EmailVendor";
import {
  BrandRequestDetails,
  Container,
  DividerLine,
  KPIContainer,
  Splitter,
} from "./styles";
import VendorAddForm from "./VendorAddForm";
import UpdateFollowUpDate from "./UpdateFollowUpDate";
import MultiValueTextField from "common/components/MultiValueTextField";
import { dissoc } from "ramda";
import * as yup from "yup";
import SentEmailsDetail from "../SentEmailsDetail";

const brandEmailValidator = yup.object({
  brandEmails: yup
    .array()
    .of(yup.string().email("All emails formats should be accurate").nullable()),
});

const KPI = ({ kpi, description, flipped, large }) => {
  const kpiElement = large ? <h2>{kpi}</h2> : <h4>{kpi}</h4>;
  const descriptionElement = <p>{description}</p>;
  return (
    <KPIContainer>
      {flipped ? descriptionElement : kpiElement}
      {flipped ? kpiElement : descriptionElement}
    </KPIContainer>
  );
};

const ViewBrandRequest = () => {
  const { brandRequestId } = useParams();
  const [showChildBrands, setShowChildBrands] = useState(false);
  const [brandEmails, setBrandEmails] = useState([]);
  const [brandEmailsError, setBrandEmailsError] = useState(false);
  const alertSuccessMessage = "Brand Request Updated";
  const url = `/brandrequests/${brandRequestId}`;
  const { response, refetch } = useAxios({
    callOnLoad: {
      clearResponse: false,
      method: "GET",
      url,
      params: {
        populate:
          "user category vendorRequests parentBrandRequest childBrandRequests",
      },
    },
  });
  const { callAxios, loading } = useAxios({
    alertSuccess: alertSuccessMessage,
    onComplete: refetch,
  });
  const { alertSuccess } = useToast();
  const { isSourcingAdmin } = useLoginContext();
  const { setModalContent, closeModal } = useModalContext();

  const adminProps = isSourcingAdmin
    ? {
        actionModal: true,
        ActionComponent: VendorAddForm,
        actionComponentProps: { brandRequestId },
        actionName: "Add Vendors",
        onActionComplete: refetch,
        deleteUrl: (vrId) => `vendorRequests/${vrId}`,
      }
    : {};

  useEffect(() => {
    if (brandEmails.length !== 0) {
      brandEmailValidator
        .validate({ brandEmails })
        .then(function (value) {
          setBrandEmailsError(false);
        })
        .catch(function (err) {
          setBrandEmailsError(true);
        });
    }
  }, [brandEmails]);

  if (!response) return <FullPageLoad fillWidth />;

  const { data: brandRequest } = response;

  return (
    <Container>
      <TopBar>
        <h1>Brand Details</h1>
        {isSourcingAdmin && (
          <Link
            to={generateLinkWithParams(routing.brandRequests.edit, {
              [linkPlaceholders.brandRequestId]: brandRequestId,
            })}
          >
            Edit
          </Link>
        )}
      </TopBar>
      <BrandRequestDetails>
        <div>
          <h3>{brandRequest.brandName}</h3>
          {brandRequest.parentBrandRequest && (
            <RowFlex>
              <h4>Parent:</h4>
              <h4>
                <Link
                  to={generateLinkWithParams(routing.brandRequests.view, {
                    [linkPlaceholders.brandRequestId]:
                      brandRequest.parentBrandRequest.id,
                  })}
                >
                  {brandRequest.parentBrandRequest.brandName}
                </Link>
              </h4>
            </RowFlex>
          )}
          {brandRequest.url && (
            <div>
              <a
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
                href={buildURL(brandRequest.url)}
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>
            </div>
          )}
          {brandRequest.brandEmail &&
            brandRequest.brandEmail.length !== 0 &&
            brandEmails.length === 0 && (
              <>
                {brandRequest.brandEmail.map((email) => (
                  <h4>{email}</h4>
                ))}
                <Link onClick={() => setBrandEmails(brandRequest.brandEmail)}>
                  Edit Email
                </Link>
              </>
            )}
          {brandEmails.length !== 0 && (
            <RowFlex column>
              <MultiValueTextField
                label="Brand Email"
                value={brandEmails}
                fillWidth
                onChange={setBrandEmails}
              />
              <Button
                onClick={async () => {
                  let data = {
                    ...brandRequest,
                    brandEmail: brandEmails.filter(Boolean),
                  };
                  callAxios({
                    method: "PUT",
                    url: `/brandRequests/${brandRequest.id}`,
                    data: dissoc("id", data),
                  });
                  setBrandEmails([]);
                }}
                disabled={brandEmailsError}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setBrandEmails([]);
                }}
              >
                Cancel
              </Button>
              {brandEmailsError && (
                <ErrorText>All emails format should be accurate</ErrorText>
              )}
            </RowFlex>
          )}
        </div>
        <DividerLine />
        <KPI kpi={brandRequest.category?.name} description="Category" />
        <KPI
          kpi={brandRequest.requestedByCustomer}
          description="Requested By Customer"
        />
        <KPI
          kpi={brandRequest.user?.name}
          description="Requested By Sales Rep"
        />
        <KPI
          kpi={format(new Date(brandRequest.createdAt), "MMMM dd, yyyy")}
          description="Requested Date"
        />
        <KPI
          kpi={brandRequest.statuses
            .map((s) => brandRequestStatusObject[s].label)
            .join(", ")}
          description="Statuses"
        />
      </BrandRequestDetails>
      {brandRequest.childBrandRequests.length > 0 && (
        <CollapsibleHeader
          header="Child Brand Requests"
          show={showChildBrands}
          setShow={setShowChildBrands}
        />
      )}
      {showChildBrands && (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {brandRequest.childBrandRequests.map((br) => {
                return (
                  <tr key={br.id}>
                    <td>{br.brandName}</td>
                    <td>{brandRequestStatusObject[br.status]?.label}</td>
                    <td>
                      <Link
                        to={generateLinkWithParams(routing.brandRequests.view, {
                          [linkPlaceholders.brandRequestId]: br.id,
                        })}
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
      <Card>
        <TableView
          filterConfig={[
            {
              name: "status",
              type: "dropdown",
              label: "Status",
              options: getSourcingStatusList(),
            },
          ]}
          bulkActions={[{ name: "Change Status", Component: BulkStatusChange }]}
          darker
          url="/vendorRequests"
          tableConfig={[
            {
              name: "name",
              header: "Vendor Name",
            },
            {
              name: "country",
              header: "Country",
            },
            {
              name: "joinedDate",
              header: "Requested Date",
              isDate: true,
            },
            {
              name: "followUpDate",
              header: "Follow Up Date",
              isDate: true,
            },
            {
              name: "lastEmail",
              header: "Last Email",
              width: "300px",
            },
            {
              name: "status",
              header: "Status",
              isDropdown: isSourcingAdmin,
              options: getSourcingStatusList(),
              onChange: (row, status, reloadTable) => {
                if (status === brandRequestStatusObject.FollowUp.value) {
                  setModalContent(
                    <UpdateFollowUpDate
                      id={row.id}
                      close={closeModal}
                      refetch={refetch}
                      reloadTable={reloadTable}
                      followUpDate={row.followUpDate}
                    />
                  );
                  return;
                }
                callAxios({
                  method: "PUT",
                  url: `/vendorRequests/${row.id}`,
                  data: { status },
                }).then(() => {
                  alertSuccess(alertSuccessMessage);
                  refetch();
                  reloadTable();
                });
              },
              loading,
            },
            {
              name: "email",
              header: "",
              type: "modal",
              icon: "email",
              Component: EmailVendor,
              componentProps: {
                title: brandRequest.brandName,
                body: brandRequest.brandEmail
                  ? `<p>Email: ${brandRequest.brandEmail}</p>`
                  : "",
              },
            },
          ]}
          linkParam={linkPlaceholders.brandRequestId}
          height="45vh"
          header="Vendors"
          {...adminProps}
          defaultParams={{
            populate: JSON.stringify([
              { path: "vendorData" },
              {
                path: "sentEmails",
                populate: "contacts",
              },
            ]),
          }}
          defaultFilters={{ brandRequest: brandRequestId }}
          shapeData={(res) =>
            res.data.data.map((d) => ({
              ...d,
              name: (
                <Link
                  to={generateLinkWithParams(routing.vendors.view, {
                    [linkPlaceholders.vendorId]: d.vendorData.id,
                  })}
                >
                  {d.vendorData?.name}
                </Link>
              ),
              country: d.vendorData.country,
              joinedDate: d.vendorData.createdAt,
              lastEmail:
                d?.sentEmails?.length !== 0 ? (
                  <>
                    <p className="truncate">
                      <b>{d.sentEmails[d.sentEmails.length - 1].subject}:</b>{" "}
                      {htmlToPlainText(
                        d.sentEmails[d.sentEmails.length - 1].body
                      )}
                    </p>
                    <TextStyledLink
                      onClick={(e) => {
                        setModalContent(
                          <SentEmailsDetail
                            vendor={d.vendorData}
                            sentEmails={d.sentEmails}
                          />
                        );
                      }}
                      style={{ marginTop: "5px" }}
                    >
                      View More
                    </TextStyledLink>
                  </>
                ) : <></>,
            }))
          }
        />
      </Card>
      <Splitter>
        <Notes
          notes={brandRequest.notes}
          onComplete={refetch}
          alertSuccess={alertSuccessMessage}
          url={url}
        />
        <Attachments
          url={url}
          attachments={brandRequest.attachments}
          onComplete={refetch}
        />
      </Splitter>
    </Container>
  );
};

function buildURL(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    return "http://" + url;
  else return url;
}

export { ViewBrandRequest, KPI, buildURL };
