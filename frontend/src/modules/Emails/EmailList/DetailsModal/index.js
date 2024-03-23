import { Button, getApiPath, openNewTab } from "common";
import React from "react";
import { Container } from "./styles";

const DetailsModal = ({ row: { id, html, subject, attachment } }) => {
  return (
    <Container>
      <h2>{subject}</h2>
      {attachment && (
        <Button
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            openNewTab(getApiPath(`/emails/${id}/downloadAttachment`));
          }}
        >
          Download Attachment
        </Button>
      )}
      <h3>Body:</h3>
      <div dangerouslySetInnerHTML={{ __html: html || "" }} />
    </Container>
  );
};

export default DetailsModal;
