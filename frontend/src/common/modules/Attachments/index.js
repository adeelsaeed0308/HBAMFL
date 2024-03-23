import {
  CollapsibleHeader,
  DeleteIcon,
  fetchImage,
  FileUpload,
  FormikSubmit,
  FormWrapper,
  Spinner,
  TextStyledLink,
  useAxios,
  useLoginContext,
} from "common";
import { useToast } from "common/context/Toast";
import { Field, Formik } from "formik";
import React, { useState } from "react";
import formikSchema from "./formikSchema";
import {
  AttachmentContainer,
  AttachmentsContainer,
  ImageContainer,
} from "./styles";

const Attachments = ({ url = "", attachments = [], onComplete = () => {} }) => {
  const { isAdmin } = useLoginContext();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { callAxios } = useAxios();
  const { alertSuccess, onError } = useToast();

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    const {
      data: { filename },
    } = await callAxios({
      method: "POST",
      url: `/files/upload`,
      data,
      headers: {
        "Content-Type": "blob",
      },
    });
    await callAxios({
      method: "PUT",
      url,
      data: {
        attachments: [...attachments, filename],
      },
    });
  };

  const handleDelete = (attachment) => {
    setLoading(true);
    callAxios({
      method: "PUT",
      url,
      data: {
        attachments: attachments.filter((att) => att !== attachment),
      },
    })
      .then(() => {
        alertSuccess("Attachment Deleted Successfully");
        onComplete();
      })
      .catch(onError)
      .finally(() => setLoading(false));
  };

  if (isAdmin || (!isAdmin && (attachments || []).length > 0)) {
    return (
      <div>
        <CollapsibleHeader header="Attachments" show={show} setShow={setShow} />
        {show && (
          <AttachmentsContainer>
            {(attachments || []).map((attachment) => {
              const filename = attachment.split("__")[2];
              const fileType = filename.substring(filename.indexOf("."));
              const isImage = [".jpg", ".jpeg", ".png"].includes(fileType);
              const src = fetchImage(attachment);
              return (
                <AttachmentContainer key={attachment}>
                  <a
                    href={src}
                    download={filename}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ImageContainer>
                      <img
                        src={
                          isImage
                            ? src
                            : fileType.includes("pdf")
                            ? "https://upload.wikimedia.org/wikipedia/commons/3/38/Icon_pdf_file.svg"
                            : "https://cdn-icons-png.flaticon.com/512/732/732220.png"
                        }
                        width={40}
                        height={40}
                        alt="Attachment"
                      />
                      <TextStyledLink>{filename}</TextStyledLink>
                    </ImageContainer>
                  </a>
                  {loading ? (
                    <Spinner inline />
                  ) : (
                    isAdmin && (
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(attachment);
                        }}
                      />
                    )
                  )}
                </AttachmentContainer>
              );
            })}
            {isAdmin && (
              <Formik
                {...formikSchema}
                onSubmit={({ file }, { resetForm }) => {
                  setLoading(true);
                  uploadFile(file)
                    .then(() => {
                      alertSuccess("File Uploaded Successfully!");
                      onComplete();
                      resetForm();
                    })
                    .catch(onError)
                    .finally(() => setLoading(false));
                }}
              >
                <FormWrapper style={{ justifyItems: "center" }}>
                  <h4>Add New Attachment</h4>
                  <Field
                    name="file"
                    component={FileUpload}
                    accept={[
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".pdf",
                      ".xlsx",
                      ".xls",
                      ".csv",
                    ]}
                  />
                  <FormikSubmit loading={loading}>Submit</FormikSubmit>
                </FormWrapper>
              </Formik>
            )}
          </AttachmentsContainer>
        )}
      </div>
    );
  }
  return null;
};

export default Attachments;
