import {
  Attachments,
  Button,
  FullPageLoad,
  Link,
  routing,
  useAxios,
} from "common";
import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "./styles";

const AttachmentsForm = () => {
  const { brandId } = useParams();
  const { response, refetch } = useAxios({
    callOnLoad: {
      clearResponse: false,
      method: "GET",
      url: `/brands/${brandId}`,
    },
  });

  if (response) {
    const brand = response.data;
    return (
      <Container>
        <h1>{brand.name}</h1>
        <Attachments
          url={`/brands/${brand.id}`}
          attachments={brand.attachments}
          onComplete={refetch}
        />
        <div>
          <Link to={routing.brands.root}>
            <Button secondary>Return to Brands List</Button>
          </Link>
        </div>
      </Container>
    );
  }
  return <FullPageLoad fillWidth />;
};

export default AttachmentsForm;
