import { linkPlaceholders,navLinks,routing,TableView } from 'common';
import React from 'react';

const CategoryList = () => {
  return (
    <TableView
      url="/categories"
      tableConfig={[
        {
          name: "name",
          header: "Name",
        },
      ]}
      navLinks={navLinks.categories}
      linkParam={linkPlaceholders.categoryId}
      actionName="Add Category"
      actionLink={routing.categories.add}
      header="Categories"
      deleteUrl={(id) => `/categories/${id}`}
      deleteMessage={(category) => `Delete ${category?.name}`}
      filterConfig={[{ name: "name", label: "Name", type: "input" }]}
    />
  );
};

export default CategoryList;
