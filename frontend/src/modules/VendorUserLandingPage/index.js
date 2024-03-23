import { routing } from "common";
import {
  VendorUserBrandList,
  VendorUserOpenBrandList,
  ViewVendorUserBrand,
} from "modules";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Container } from "./styles";
import { useVendorUserVendor, VendorProvider } from "./VendorProvider";

const VendorUserLandingPage = () => {
  //absolute nested paths are not supported
  //https://github.com/remix-run/react-router/issues/8035
  const transformRoute = (route = "") =>
    route.replace(`${routing.vendorUsers.root}/`, "");

  return (
    <Container>
      <VendorProvider>
        <Routes>
          <Route
            path={transformRoute(routing.vendorUsers.brands)}
            element={<VendorUserBrandList />}
          />
          <Route
            path={transformRoute(routing.vendorUsers.viewBrand)}
            element={<ViewVendorUserBrand />}
          />
          <Route
            path={transformRoute(routing.vendorUsers.openBrands)}
            element={<VendorUserOpenBrandList />}
          />
          <Route
            path={transformRoute(routing.vendorUsers.editBrand)}
            element={<ViewVendorUserBrand edit={true}/>}
          />
          <Route
            path={transformRoute(routing.vendorUsers.addBrand)}
            element={<ViewVendorUserBrand add={true}/>}
          />
        </Routes>
      </VendorProvider>
      <Outlet />
    </Container>
  );
};

export { VendorUserLandingPage, useVendorUserVendor };
