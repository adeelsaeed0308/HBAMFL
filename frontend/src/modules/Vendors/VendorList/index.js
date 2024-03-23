import {
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
  useCountries,
  useLoginContext,
} from "common";
import React from "react";

const VendorList = () => {
  const { isAdmin } = useLoginContext();
  const countries = useCountries();
  const adminProps = isAdmin
    ? {
        deleteUrl: (id) => `/vendors/${id}`,
        deleteMessage: (vendor) => `Delete ${vendor.name}`,
        actionLink: routing.vendors.add,
        actionName: "Add Vendor",
      }
    : {};
  const filterConfig = [
    {
      name: "country",
      type: "dropdown",
      options: countries,
      label: "Filter By Country",
    },
    {
      name: "name",
      type: "input",
      label: "Search",
    },
  ];
  return (
    <TableView
      to={routing.vendors.view}
      url="/vendors"
      tableConfig={[
        {
          name: "name",
          header: "Name",
        },
        {
          name: "country",
          header: "Country",
        },
      ]}
      navLinks={navLinks.vendors}
      linkParam={linkPlaceholders.vendorId}
      header="Vendors"
      filterConfig={filterConfig}
      {...adminProps}
    />
  );
};

export default VendorList;
