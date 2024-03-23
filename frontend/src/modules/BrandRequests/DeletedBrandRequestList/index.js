import { linkPlaceholders, TableView, useCategories, useUsers } from "common";
import React from "react";

const DeletedBrandRequestList = () => {
  const { categories } = useCategories();
  const users = useUsers(true);
  return (
    <TableView
      url="/brandrequests/deleted"
      tableConfig={[
        {
          name: "brandName",
          header: "Name",
        },
        {
          name: "category",
          header: "Category",
        },
        {
          name: "deletedAt",
          header: "Deleted",
          isDate: true,
        },
        {
          name: "deletedBy",
          header: "Deleted By",
        },
      ]}
      linkParam={linkPlaceholders.vendorContactId}
      header="Deleted Brands"
      defaultParams={{ populate: "category" }}
      filterConfig={[
        {
          name: "brandName",
          type: "input",
          label: "Name",
        },
        {
          name: "category",
          type: "dropdown",
          label: "Category",
          options: categories,
        },
      ]}
      shapeData={(d) =>
        d.data.data.map((dd) => ({
          ...dd,
          category: dd.category?.name,
          deletedBy: users[dd.deletedBy],
        }))
      }
    />
  );
};

export default DeletedBrandRequestList;
