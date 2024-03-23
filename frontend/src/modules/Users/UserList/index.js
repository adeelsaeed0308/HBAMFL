import { linkPlaceholders, navLinks, routing, TableView } from "common";
import React from "react";

const UserList = () => {
  return (
    <TableView
      url="/users"
      tableConfig={[
        {
          name: "email",
          header: "Email",
        },
        {
          name: "name",
          header: "Name",
        },
        {
          name: "role",
          header: "Role",
        },
      ]}
      navLinks={navLinks.users}
      linkParam={linkPlaceholders.userId}
      actionName="Add User"
      actionLink={routing.users.add}
      header="Users"
      deleteUrl={(id) => `/users/${id}`}
      deleteMessage={(user) => `Delete ${user.name}`}
      defaultFilters={{ vendor: null }}
      filterConfig={[
        {
          name: "role",
          label: "Role",
          type: "dropdown",
          options: [
            { label: "Admin", value: "Admin" },
            { label: "Sales Rep", value: "SalesRep" },
          ],
        },
        {
          name: "email",
          label: "Email",
          type: "input",
        },
      ]}
    />
  );
};

export default UserList;
