import {
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
  useCountries,
  useLoginContext,
} from "common";
import React from "react";

const VendorBrandList = () => {
  const { isAdmin } = useLoginContext();
  const countries = useCountries();
  const adminProps = isAdmin
  ? {
      deleteUrl: (id) => `/vendorBrands/${id}`,
      deleteMessage: (vendor) => `Delete ${vendor.name}`,
      actionLink: routing.vendorBrands.add,
      actionName: "Add Price Sheet Vendor",
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
      // to={routing.vendors.view}
      {...adminProps}
      url="/vendorBrands"
      tableConfig={[
        {
          name: "name",
          header: "Name",
        },
        {
          name: "country",
          header: "Country",
        },
        {
          name: "code",
          header: "Code",
        },
        {
          name: "attachments",
          header: "Files",
        },
      ]}
      shapeData={(res) => {
        let attachments = [];

        for (let i = 0; i < res.data.data.length; i++) {
          const vendor = res.data.data[i];
          vendor.brandPriceSheets.forEach((priceSheet) => {
            priceSheet.attachments.forEach((attachment) => {
              attachments.push(
                attachment
              );
            });
          });
          for (let i = 0; i < attachments.length - 1; i++) {
            attachments[i] = attachments[i] + ", ";
          }
          res.data.data[i].attachments = attachments;
          attachments = [];
        }

        return res.data.data.map((d) => ({
          ...d,
        }));
      }}
      linkParam={linkPlaceholders.vendorBrandId}
      navLinks={navLinks.vendorBrands}
      header="Vendors"
      filterConfig={filterConfig}
    />
  );
};

export default VendorBrandList;
