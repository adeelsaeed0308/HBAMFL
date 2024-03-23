import { Add, Download, View } from "@carbon/icons-react";
import {
  Button,
  DatePicker,
  fetchImage,
  RowFlex,
  Spinner,
  TextField,
  TextStyledLink,
  Toggle,
  useUploadFile,
} from "common";
import useDeleteFile from "common/hooks/useDeleteFile";
import { buildURL } from "modules/BrandRequests";
import { useVendorUserVendor } from "modules/VendorUserLandingPage";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BrandDetails = ({
  callAxios,
  isOpen,
  edit,
  add,
  status,
  category,
  name,
  isAccepted,
  brandName,
}) => {
  const { vendorRequestId } = useParams();
  const { vendor } = useVendorUserVendor();
  const vendorRequest = vendor?.vendorRequests?.find(
    (vr) => vr?.id === vendorRequestId
  );
  const url = `vendorRequests/${vendorRequest?.id}`;
  const { uploadFile, uploadLoading } = useUploadFile();
  const { deleteFile } = useDeleteFile();

  const [notes, setNotes] = useState(vendorRequest?.notes || "");
  const [website, setWebsite] = useState(
    vendorRequest?.url || vendorRequest?.brandRequest?.url || ""
  );
  const [emails, setEmails] = useState(vendorRequest?.emails || []);
  const [phone, setPhone] = useState(vendorRequest?.phone || "");
  const [linkedIn, setLinkedIn] = useState(!!vendorRequest?.linkedIn);
  const [orderForm, setOrderForm] = useState(
    Array.isArray(vendorRequest?.orderForm)
      ? vendorRequest?.orderForm
      : vendorRequest?.orderForm
      ? [vendorRequest?.orderForm]
      : []
  );
  const [pricesheet, setPricesheet] = useState(
    Array.isArray(vendorRequest?.pricesheet)
      ? vendorRequest?.pricesheet
      : vendorRequest?.pricesheet
      ? [vendorRequest?.pricesheet]
      : []
  );
  const [selectedOrderForm, setSelectedOrderForm] = useState([]);
  const [selectedPricesheet, setSelectedPricesheet] = useState([]);
  // const [pricesheet, setPricesheet] = useState(vendorRequest.pricesheet || "");
  const hasPricesheet = !!pricesheet;
  const [training, setTraining] = useState(vendorRequest?.training);
  const [terms, setTerms] = useState(vendorRequest?.terms);
  const [discount, setDiscount] = useState(vendorRequest?.discount);
  const [fob, setFob] = useState(vendorRequest?.fob);
  const navigate = useNavigate();

  useEffect(() => {
    if (edit) {
    }
  }, [
    website,
    phone,
    emails,
    notes,
    pricesheet,
    selectedPricesheet,
    orderForm,
    selectedOrderForm,
    training,
    terms,
    discount,
    fob,
    isAccepted,
  ]);

  const handleAddBrand = () => {
    if (!status) {
      return alert("Please select status");
    }
    callAxios({
      url: "/brandRequests",
      method: "POST",
      data: {
        brandName: name,
        url: website,
        category,
        notes,
        status,
        isAccepted,
      },
    })
      .then(({ data }) =>
        callAxios({
          url: "/vendorRequests",
          method: "POST",
          data: {
            brandRequest: data?.id,
            status,
            vendor: vendor.id || vendor?._id,
            orderForm,
            linkedIn,
            notes,
            phone,
            emails,
            isAccepted,
          },
        })
      )
      .then(() => navigate("/vendor_users/brands"));
    // callAxios({
    //   method: "POST",
    //   url: "/vendorRequests",
    //   data: { status, emails, phone, orderForm, notes, linkedIn },
    // });
  };

  return (
    <>
      {add ? (
        <Fragment>
          <RowFlex extend responsive style={{ alignItems: "start" }}>
            <RowFlex column style={{ alignItems: "start" }}>
              <RowFlex>
                <TextField
                  label="Website"
                  value={website}
                  onChange={(v) => setWebsite(v)}
                />
                {website && (
                  <a href={buildURL(website)} target="_blank" rel="noreferrer">
                    <View />
                  </a>
                )}
              </RowFlex>
              <RowFlex>
                <h4>Emails</h4>
                <TextStyledLink>
                  <Add
                    onClick={() => setEmails((p) => [...p.filter(Boolean), ""])}
                  />
                </TextStyledLink>
              </RowFlex>
              <RowFlex responsive>
                {emails.map((email, idx) => (
                  <RowFlex key={idx}>
                    <TextField
                      value={email}
                      onChange={(v) =>
                        setEmails((prev) =>
                          prev.map((p, pIdx) => (pIdx === idx ? v : p))
                        )
                      }
                    />
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEmails((p) => p.filter((_, pIdx) => pIdx !== idx));
                      }}
                    >
                      X
                    </div>
                  </RowFlex>
                ))}
              </RowFlex>
              <TextField
                label="Phone"
                value={phone}
                onChange={(v) => setPhone(v)}
              />
              <RowFlex responsive>
                <Toggle
                  checked={linkedIn}
                  onChange={setLinkedIn}
                  label="LinkedIn"
                />
                {!!orderForm.length && (
                  <>
                    <TextStyledLink>
                      <a
                        href={fetchImage(orderForm)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <RowFlex>
                          Download Online Form
                          <Download />
                          {/* <p>{getFilename(orderForm)}</p> */}
                        </RowFlex>
                      </a>
                    </TextStyledLink>
                    <p
                      style={{ cursor: "pointer" }}
                      // onClick={() => deleteFile(orderForm).then(setOrderForm(""))}
                    >
                      X
                    </p>
                  </>
                )}
              </RowFlex>
              <h4>Upload {orderForm.length ? "New" : ""} Online Form</h4>
              <input
                type="file"
                accept="*"
                multiple="multiple"
                onChange={(e) => {
                  const files = { ...e.target.files };
                  e.target.files = null;
                  e.target.value = null;
                  if (!Object.keys(files).length) return;
                  setSelectedOrderForm(
                    Object.keys(files).map((key) => files[key])
                  );
                }}
              />
              {!!orderForm.length &&
                orderForm.map((f) => (
                  <div style={{ display: "flex", gap: 10 }}>
                    <p key={f}>{f.substring(0, 30) + "..."}</p>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        await Promise.all([
                          deleteFile(f),
                          setOrderForm((prev) => prev.filter((i) => i !== f)),
                        ]);
                      }}
                    >
                      X
                    </p>
                  </div>
                ))}
              {!!selectedOrderForm.length && <p>-------new-------</p>}
              {!!selectedOrderForm.length &&
                selectedOrderForm.map(({ name }) => (
                  <p
                    key={name}
                    onClick={() => {
                      setSelectedOrderForm((prev) =>
                        prev.filter((f) => f.name !== name)
                      );
                    }}
                  >
                    {name}
                  </p>
                ))}
              <Button
                onClick={async () => {
                  if (selectedOrderForm.length) {
                    selectedOrderForm.map(async (f) => {
                      const {
                        data: { filename },
                      } = await uploadFile(f);
                      setOrderForm((prev) => [...prev, filename]);
                      setSelectedOrderForm([]);
                    });
                  }
                }}
                disabled={!selectedOrderForm.length}
              >
                Save
              </Button>
              {uploadLoading && <Spinner inline />}
              {isOpen && (
                <Fragment>
                  <DatePicker
                    value={training}
                    onChange={setTraining}
                    label="Training"
                  />
                  <RowFlex>
                    <TextField
                      label="Terms"
                      value={terms}
                      onChange={setTerms}
                    />
                    <TextField
                      label="Discount"
                      value={discount}
                      onChange={setDiscount}
                    />
                    <TextField label="FOB" value={fob} onChange={setFob} />
                  </RowFlex>
                </Fragment>
              )}
            </RowFlex>
            <div style={{ maxWidth: "300px" }}>
              {isOpen && (
                <Fragment>
                  <RowFlex responsive>
                    {/* {pricesheet && (
                  <>
                    <TextStyledLink>
                      <a
                        href={fetchImage(pricesheet)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <RowFlex>
                          Download Pricesheet
                          <Download />
                          <p>{getFilename(pricesheet)}</p>
                        </RowFlex>
                      </a>
                    </TextStyledLink>
                    <p
                      style={{ cursor: "pointer" }}
                      // onClick={() =>
                      // deleteFile(orderForm).then(setPricesheet(""))
                      // }
                    >
                      X
                    </p>
                  </>
                )} */}
                  </RowFlex>
                  <h4>Upload {pricesheet ? "New" : ""} Pricesheet</h4>
                  <input
                    type="file"
                    accept="*"
                    multiple="multiple"
                    onChange={(e) => {
                      const files = { ...e.target.files };
                      e.target.files = null;
                      e.target.value = null;
                      if (!Object.keys(files).length) return;
                      setSelectedPricesheet(
                        Object.keys(files).map((key) => files[key])
                      );
                    }}
                  />
                  {!!pricesheet.length &&
                    pricesheet.map((f) => (
                      <div style={{ display: "flex", gap: 10 }}>
                        <p key={f}>{f.substring(0, 30) + "..."}</p>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            await Promise.all([
                              deleteFile(f),
                              setPricesheet((prev) =>
                                prev.filter((i) => i !== f)
                              ),
                            ]);
                          }}
                        >
                          X
                        </p>
                      </div>
                    ))}
                  {!!selectedPricesheet.length && <p>-------new-------</p>}
                  {!!selectedPricesheet.length &&
                    selectedPricesheet.map(({ name }) => (
                      <p
                        key={name}
                        onClick={() => {
                          setSelectedPricesheet((prev) =>
                            prev.filter((f) => f.name !== name)
                          );
                        }}
                      >
                        {name}
                      </p>
                    ))}
                  <Button
                    onClick={async () => {
                      if (selectedPricesheet.length) {
                        selectedPricesheet.map(async (f) => {
                          const {
                            data: { filename },
                          } = await uploadFile(f);
                          setPricesheet((prev) => [...prev, filename]);

                          setSelectedPricesheet([]);
                        });
                      }
                    }}
                    disabled={!selectedPricesheet.length}
                  >
                    Save
                  </Button>
                  {uploadLoading && <Spinner inline />}
                </Fragment>
              )}
              <TextField
                isArea
                value={notes}
                onChange={(v) => setNotes(v)}
                label="Notes"
              />
            </div>
          </RowFlex>
          <div style={{ marginTop: 20 }}>
            <Button onClick={() => handleAddBrand()}>Create Brand</Button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <RowFlex extend responsive style={{ alignItems: "start" }}>
            <RowFlex column style={{ alignItems: "start" }}>
              <RowFlex>
                <TextField
                  label="Website"
                  value={website}
                  onChange={(v) => setWebsite(v)}
                />
                {website && (
                  <a href={website} target="_blank" rel="noreferrer">
                    <View />
                  </a>
                )}
              </RowFlex>
              <RowFlex>
                <h4>Emails</h4>
                <TextStyledLink>
                  <Add
                    onClick={() => setEmails((p) => [...p.filter(Boolean), ""])}
                  />
                </TextStyledLink>
              </RowFlex>
              <RowFlex responsive>
                {emails.map((email, idx) => (
                  <RowFlex key={idx}>
                    <TextField
                      value={email}
                      onChange={(v) =>
                        setEmails((prev) =>
                          prev.map((p, pIdx) => (pIdx === idx ? v : p))
                        )
                      }
                    />
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEmails((p) => p.filter((_, pIdx) => pIdx !== idx));
                      }}
                    >
                      X
                    </div>
                  </RowFlex>
                ))}
              </RowFlex>
              <TextField
                label="Phone"
                value={phone}
                onChange={(v) => setPhone(v)}
              />
              <RowFlex responsive>
                <Toggle
                  checked={linkedIn}
                  onChange={setLinkedIn}
                  label="LinkedIn"
                />
                {!!orderForm.length && (
                  // <>
                  //   <TextStyledLink>
                  //     <a
                  //       href={fetchImage(orderForm)}
                  //       target="_blank"
                  //       rel="noreferrer"
                  //     >
                  //       <RowFlex>
                  //         Download Online Form
                  //         <Download />
                  //         {/* <p>{getFilename(orderForm)}</p> */}
                  //       </RowFlex>
                  //     </a>
                  //   </TextStyledLink>
                  //   <p
                  //     style={{ cursor: "pointer" }}
                  //     // onClick={() => deleteFile(orderForm).then(setOrderForm(""))}
                  //   >
                  //     X
                  //   </p>
                  // </>
                  <></>
                )}
              </RowFlex>
              {edit ? (
                <>
                  <h4>Upload {orderForm.length ? "New" : ""} Online Form</h4>
                  <input
                    type="file"
                    accept="*"
                    multiple="multiple"
                    onChange={(e) => {
                      const files = { ...e.target.files };
                      e.target.files = null;
                      e.target.value = null;
                      if (!Object.keys(files).length) return;
                      setSelectedOrderForm(
                        Object.keys(files).map((key) => files[key])
                      );
                    }}
                  />
                </>
              ) : (
                <></>
              )}
              {!!orderForm.length &&
                orderForm.map((f) => (
                  <div style={{ display: "flex", gap: 10 }}>
                    <p key={f}>{f.substring(f.lastIndexOf("_") + 1)}</p>
                    <a href={fetchImage(f)} target="_blank" rel="noreferrer">
                      <Download />
                    </a>
                    {edit && (
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                          await Promise.all([
                            deleteFile(f),
                            setOrderForm((prev) => prev.filter((i) => i !== f)),
                          ]);
                        }}
                      >
                        X
                      </p>
                    )}
                  </div>
                ))}
              {!!selectedOrderForm.length && <p>-------new-------</p>}
              {!!selectedOrderForm.length &&
                selectedOrderForm.map(({ name }) => (
                  <p
                    key={name}
                    onClick={() => {
                      setSelectedOrderForm((prev) =>
                        prev.filter((f) => f.name !== name)
                      );
                    }}
                  >
                    {name}
                  </p>
                ))}
              {edit && (
                <Button
                  onClick={async () => {
                    let newOrderForm = [...orderForm];
                    if (selectedOrderForm.length) {
                      await Promise.all(
                        selectedOrderForm.map(async (f) => {
                          const {
                            data: { filename },
                          } = await uploadFile(f);
                          setOrderForm((prev) => [...prev, filename]);
                          newOrderForm.push(filename);
                          setSelectedOrderForm([]);
                        })
                      );
                    }
                    callAxios({
                      method: "PUT",
                      url,
                      data: {
                        url: website,
                        phone: phone,
                        emails: emails,
                        notes: notes,
                        pricesheet: pricesheet,
                        orderForm: newOrderForm,
                        training: training,
                        terms: terms,
                        discount: discount,
                        fob: fob,
                        isAccepted: isAccepted,
                      },
                    });
                    callAxios({
                      method: "PUT",
                      url: `brandRequests/${vendorRequest?.brandRequest?.id}`,
                      data: {
                        brandName,
                        category,
                      },
                    });
                  }}
                >
                  Save
                </Button>
              )}
              {uploadLoading && <Spinner inline />}
              {isOpen && (
                <Fragment>
                  <DatePicker
                    value={training}
                    onChange={setTraining}
                    label="Training"
                  />
                  <RowFlex>
                    <TextField
                      label="Terms"
                      value={terms}
                      onChange={setTerms}
                    />
                    <TextField
                      label="Discount"
                      value={discount}
                      onChange={setDiscount}
                    />
                    <TextField label="FOB" value={fob} onChange={setFob} />
                  </RowFlex>
                </Fragment>
              )}
            </RowFlex>
            <div style={{ maxWidth: "300px" }}>
              {isOpen && (
                <Fragment>
                  <RowFlex responsive>
                    {/* {pricesheet && (
                  <>
                    <TextStyledLink>
                      <a
                        href={fetchImage(pricesheet)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <RowFlex>
                          Download Pricesheet
                          <Download />
                          <p>{getFilename(pricesheet)}</p>
                        </RowFlex>
                      </a>
                    </TextStyledLink>
                    <p
                      style={{ cursor: "pointer" }}
                      // onClick={() =>
                      // deleteFile(orderForm).then(setPricesheet(""))
                      // }
                    >
                      X
                    </p>
                  </>
                )} */}
                  </RowFlex>
                  <h4>Upload {pricesheet ? "New" : ""} Pricesheet</h4>
                  <input
                    type="file"
                    accept="*"
                    multiple="multiple"
                    onChange={(e) => {
                      const files = { ...e.target.files };
                      e.target.files = null;
                      e.target.value = null;
                      if (!Object.keys(files).length) return;
                      setSelectedPricesheet(
                        Object.keys(files).map((key) => files[key])
                      );
                    }}
                  />
                  {!!pricesheet.length &&
                    pricesheet.map((f) => (
                      <div style={{ display: "flex", gap: 10 }}>
                        <p key={f}>{f.substring(f.lastIndexOf("_") + 1)}</p>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={async () => {
                            await Promise.all([
                              deleteFile(f),
                              setPricesheet((prev) =>
                                prev.filter((i) => i !== f)
                              ),
                            ]);
                          }}
                        >
                          X
                        </p>
                      </div>
                    ))}
                  {!!selectedPricesheet.length && <p>-------new-------</p>}
                  {!!selectedPricesheet.length &&
                    selectedPricesheet.map(({ name }) => (
                      <p
                        key={name}
                        onClick={() => {
                          setSelectedPricesheet((prev) =>
                            prev.filter((f) => f.name !== name)
                          );
                        }}
                      >
                        {name}
                      </p>
                    ))}
                  <Button
                    onClick={async () => {
                      if (selectedPricesheet.length) {
                        selectedPricesheet.map(async (f) => {
                          const {
                            data: { filename },
                          } = await uploadFile(f);
                          setPricesheet((prev) => [...prev, filename]);

                          setSelectedPricesheet([]);
                        });
                      }
                    }}
                    disabled={!selectedPricesheet.length}
                  >
                    Save
                  </Button>
                  {uploadLoading && <Spinner inline />}
                </Fragment>
              )}
              <TextField
                isArea
                value={notes}
                onChange={(v) => setNotes(v)}
                label="Notes"
              />
            </div>
          </RowFlex>
        </Fragment>
      )}
    </>
  );
};

export default BrandDetails;
