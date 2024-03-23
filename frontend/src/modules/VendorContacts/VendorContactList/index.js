import {
  generateLinkWithParams,
  Link,
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
  useLoginContext,
  useVendors,
} from "common";
import React from "react";

const VendorContactList = () => {
  const { isAdmin } = useLoginContext();
  const vendors = useVendors();
  const adminProps = isAdmin
    ? {
        deleteUrl: (id) => `/vendorcontacts/${id}`,
        deleteMessage: (vendorContact) => `Delete ${vendorContact.name}`,
        actionLink: routing.vendorContacts.add,
        actionName: "Add Vendor Contact",
      }
    : {};
  const filterConfig = [
    {
      name: "name",
      type: "input",
      label: "Name",
    },
    {
      name: "email",
      type: "input",
      label: "Email",
    },
    {
      name: "vendor",
      type: "dropdown",
      label: "Vendor",
      options: vendors,
    },
  ];
  return (
    <TableView
      url="/vendorcontacts"
      tableConfig={[
        {
          name: "vendor",
          header: "Vendor",
        },
        {
          name: "name",
          header: "Name",
        },
        {
          name: "email",
          header: "Email",
        },
      ]}
      navLinks={navLinks.vendorContacts}
      linkParam={linkPlaceholders.vendorContactId}
      header="Vendor Contacts"
      filterConfig={filterConfig}
      defaultParams={{ populate: "vendor" }}
      {...adminProps}
      shapeData={(d) =>
        d.data.data.map((contact) => ({
          ...contact,
          vendor: (
            <Link
              to={generateLinkWithParams(routing.vendors.view, {
                [linkPlaceholders.vendorId]: contact.vendor.id,
              })}
            >
              {contact.vendor.name}
            </Link>
          ),
        }))
      }
    />
  );
};

export default VendorContactList;
