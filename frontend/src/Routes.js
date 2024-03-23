import { routing, useLoginContext } from "common";
import LoginProccess from "common/context/Login/LoginProcess";
import ResetPasswordPage from "common/context/Login/ResetPassword";
import {
  AddBrand,
  AddBrandRequest,
  AddCategory,
  AddUser,
  AddVendor,
  AddVendorContact,
  AddVendorUser,
  AttachmentsForm,
  BrandList,
  BrandListTable,
  BrandRequestBulkImport,
  BrandRequestList,
  CategoryList,
  ChangeFile,
  ChangeImage,
  DeletedBrandRequestList,
  EditBrand,
  EditBrandRequest,
  EditCategory,
  EditUser,
  EditVendor,
  EditVendorContact,
  EmailList,
  LandingPage,
  LoanLandingPage,
  UserList,
  VendorContactList,
  VendorList,
  VendorRequestList,
  VendorUserLandingPage,
  ViewBrand,
  ViewBrandRequest,
  ViewVendor,
} from "modules";
import Reports from "modules/Reports";
import {
  AddVendorBrand,
  EditVendorBrand,
  VendorBrandList,
} from "modules/VendorBrands";
import React from "react";
import { Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

const Routes = () => {
  const { isSourcingUserOnly, currentUser, fetchUser } = useLoginContext();
  console.log(currentUser, "currentUser");
  return (
    <RouterRoutes>
      {currentUser ? (
        <>
          <Route path={routing.brandList.root} element={<BrandListTable />} />
          <Route
            path={routing.vendorUsers.root + "/*"}
            element={<VendorUserLandingPage />}
          />
          <Route
            path={routing.loansRoot + "/*"}
            element={<LoanLandingPage />}
          />
          <Route path={routing.users.edit} element={<EditUser />} />
          <Route path={routing.users.add} element={<AddUser />} />
          <Route path={routing.users.root} element={<UserList />} />
          <Route path={routing.categories.edit} element={<EditCategory />} />
          <Route path={routing.categories.add} element={<AddCategory />} />
          <Route path={routing.categories.root} element={<CategoryList />} />
          <Route
            path={routing.brands.attachments}
            element={<AttachmentsForm />}
          />
          <Route path={routing.brands.changeFile} element={<ChangeFile />} />
          <Route path={routing.brands.changeImage} element={<ChangeImage />} />
          <Route path={routing.brands.view} element={<ViewBrand />} />
          <Route path={routing.brands.edit} element={<EditBrand />} />
          <Route path={routing.brands.add} element={<AddBrand />} />
          <Route path={routing.brands.root} element={<BrandList />} />
          <Route
            path={routing.brandRequests.bulkImport}
            element={<BrandRequestBulkImport />}
          />
          <Route
            path={routing.brandRequests.vendorRequests}
            element={<VendorRequestList />}
          />
          <Route
            path={routing.brandRequests.view}
            element={<ViewBrandRequest />}
          />
          <Route
            path={routing.brandRequests.edit}
            element={<EditBrandRequest />}
          />
          <Route
            path={routing.brandRequests.add}
            element={<AddBrandRequest />}
          />
          <Route
            path={routing.brandRequests.deleted}
            element={<DeletedBrandRequestList />}
          />
          <Route
            path={routing.brandRequests.root}
            element={
              isSourcingUserOnly ? <AddBrandRequest /> : <BrandRequestList />
            }
          />
          <Route
            path={routing.report.root}
            element={<Reports />}
          />
          <Route path={routing.vendors.addUser} element={<AddVendorUser />} />
          <Route path={routing.vendors.view} element={<ViewVendor />} />
          <Route path={routing.vendors.edit} element={<EditVendor />} />
          <Route path={routing.vendors.add} element={<AddVendor />} />
          <Route path={routing.vendors.root} element={<VendorList />} />
          <Route
            path={routing.vendorContacts.edit}
            element={<EditVendorContact />}
          />
          <Route
            path={routing.vendorContacts.add}
            element={<AddVendorContact />}
          />
          <Route
            path={routing.vendorContacts.root}
            element={<VendorContactList />}
          />
          <Route path={routing.vendorBrands.add} element={<AddVendorBrand />} />
          <Route
            path={routing.vendorBrands.edit}
            element={<EditVendorBrand />}
          />
          <Route
            path={routing.vendorBrands.root}
            element={<VendorBrandList />}
          />
          <Route path={routing.emails.root} element={<EmailList />} />
          <Route path={routing.home} element={<LandingPage />} />
          <Route path={routing.home} element={<LandingPage />} />
          <Route path="*" element={<Navigate to={routing.home} />} />
        </>
      ) : (
        <>
          <Route path={routing.reset} element={<ResetPasswordPage />} />
          <Route path="/" element={<LoginProccess fetchUser={fetchUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </RouterRoutes>
  );
};

export default Routes;
