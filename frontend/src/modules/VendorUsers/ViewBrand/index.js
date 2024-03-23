import {
  brandRequestStatusObject,
  Button,
  DividerHorizontal,
  Dropdown,
  getSourcingStatusList,
  RowFlex,
  Spinner,
  TextField,
  useAxios,
  useCategories,
  useLoginContext,
} from "common";
import { useVendorUserVendor } from "modules/VendorUserLandingPage";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BrandDetails from "./BrandDetails";
import FollowUps from "./FollowUps";
import Orders from "./Orders";
import { Container } from "./styles";

const ViewBrand = ({ edit, add }) => {
  const { vendorRequestId } = useParams();

  const { vendor, refetchVendor, vendorLoading } = useVendorUserVendor();
  const { callAxios, loading } = useAxios({
    onComplete: () => refetchVendor(),
  });
  const vendorRequest = vendor?.vendorRequests?.find(
    (vr) => vr?.id === vendorRequestId
  );
  const isOpen = ["Open", "Closed", "Ordered"].includes(vendorRequest?.status);
  const url = `vendorRequests/${vendorRequest?.id}`;

  const statusOptions = getSourcingStatusList();
  const { updateBrandRequests } = useLoginContext();

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const { categories: categoryOptions } = useCategories();
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (vendorRequest?.brandRequest?.brandName && !name && edit) {
      setName(vendorRequest?.brandRequest?.brandName);
      setCategory(vendorRequest?.brandRequest?.category?._id)
    }
  }, [vendorRequest]);

  return (
    <>
      {add ? (
        <Container>
          <RowFlex extend responsive>
            <RowFlex column>
              <RowFlex>
                <TextField
                  label="Brand Name"
                  value={name}
                  onChange={(v) => setName(v)}
                />
                {vendorLoading && <Spinner inline />}
              </RowFlex>
              <div style={{ width: "150px" }}>
                <Dropdown
                  label="Category"
                  loading={loading}
                  value={category}
                  options={categoryOptions}
                  onChange={(category) => {
                    setCategory(category);
                  }}
                />
              </div>
              <div style={{ width: "150px" }}>
                <Dropdown
                  label="Status"
                  loading={loading}
                  value={status}
                  options={statusOptions}
                  onChange={(status) => {
                    setStatus(status);
                  }}
                />
              </div>
            </RowFlex>
          </RowFlex>

          <DividerHorizontal pad />
          <BrandDetails
            add={add}
            // status={"VendorCreated"}
            isAccepted={isAccepted}
            status={status}
            category={category}
            name={name}
            callAxios={callAxios}
            isOpen={isOpen}
          />

          <DividerHorizontal pad />
          {/* {isOpen ? (
            <Orders callAxios={callAxios} loading={loading} />
          ) : (
            <FollowUps callAxios={callAxios} loading={loading} />
          )} */}
        </Container>
      ) : (
        <Container>
          <RowFlex extend responsive>
            <RowFlex column>
              <RowFlex>
                {!edit ? (
                  <h2>{vendorRequest?.brandRequest?.brandName}</h2>
                ) : (
                  <TextField
                    label="Brand Name"
                    value={name}
                    onChange={(v) => setName(v)}
                  />
                )}
                {vendorLoading && <Spinner inline />}
              </RowFlex>
              <div>
                {edit ? (
                  <Dropdown
                    label="Category"
                    loading={loading}
                    value={category}
                    options={categoryOptions}
                    onChange={(category) => {
                      setCategory(category);
                    }}
                  />
                ) : (
                  <> Category: {vendorRequest?.brandRequest?.category?.name}</>
                )}
              </div>
              <div>
                Status:{" "}
                <strong>
                  {brandRequestStatusObject[vendorRequest.status]?.label}
                </strong>
              </div>
            </RowFlex>
            <RowFlex responsive column>
              {isOpen && vendorRequest.status !== "Closed" && (
                <div style={{ width: "200px" }}>
                  <Button
                    loading={loading}
                    onClick={() =>
                      callAxios({
                        method: "PUT",
                        url,
                        data: { status: "Closed" },
                      })
                    }
                  >
                    MOVE TO CLOSED
                  </Button>
                </div>
              )}
              {!isOpen && (
                <Fragment>
                  <div style={{ width: "150px" }}>
                    <Button
                      loading={loading}
                      onClick={() => {
                        callAxios({
                          method: "PUT",
                          url,
                          data: { status: "Open" },
                        }).then(() => updateBrandRequests(vendor?._id));
                      }}
                    >
                      MOVE TO OPEN
                    </Button>
                  </div>
                  <div style={{ width: "150px" }}>
                    <Dropdown
                      label="Status"
                      loading={loading}
                      value={vendorRequest.status}
                      options={statusOptions}
                      onChange={(status) => {
                        if (edit) {
                          callAxios({
                            method: "PUT",
                            url,
                            data: { status },
                          });
                        }
                      }}
                    />
                  </div>
                </Fragment>
              )}
            </RowFlex>
          </RowFlex>
          <DividerHorizontal pad />
          <BrandDetails
            edit={edit}
            callAxios={callAxios}
            isOpen={isOpen}
            brandName={name}
            category={category}
          />

          <DividerHorizontal pad />
          {isOpen ? (
            <Orders callAxios={callAxios} loading={loading} />
          ) : (
            <FollowUps callAxios={callAxios} loading={loading} />
          )}
        </Container>
      )}
    </>
  );
};

export default ViewBrand;
