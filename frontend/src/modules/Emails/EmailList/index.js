import { linkPlaceholders, TableView } from "common";
import React from "react";
import DetailsModal from "./DetailsModal";

const DeletedBrandRequestList = () => {
  return (
    <TableView
      url="/emails"
      tableConfig={[
        {
          name: "sentBy",
          header: "Sent By",
        },
        {
          name: "fromEmail",
          header: "From",
        },
        {
          name: "to",
          header: "To",
        },
        {
          name: "subject",
          header: "Subject",
        },
        {
          name: "createdAt",
          header: "Sent",
          isDateTime: true,
        },
        {
          name: "details",
          header: "",
          type: "modal",
          Component: DetailsModal,
          icon: "details",
        },
      ]}
      linkParam={linkPlaceholders.vendorContactId}
      header="Sent Emails"
      defaultParams={{ populate: "sentBy", sort: "-createdAt" }}
      shapeData={(d) =>
        d.data.data.map((dd) => ({
          ...dd,
          sentBy: dd.sentBy?.name,
        }))
      }
    />
  );
};

export default DeletedBrandRequestList;
