import { curry } from "ramda";
import { FaEdit } from "react-icons/fa";
import { HiEye } from "react-icons/hi";
import { isRequestOpen } from "./functions";

const localStorageKeys = {
  listView: "HBA_MFL_LIST_VIEW",
};

const generateLinkWithParams = curry((link, params) => {
  let newLink = link;
  for (const key of Object.keys(params)) {
    newLink = newLink.replace(key, params[key]);
  }
  return newLink;
});

const linkPlaceholders = {
  brandId: ":brandId",
  brandRequestId: ":brandRequestId",
  categoryId: ":categoryId",
  loanAccountDueDateId: ":loanAccountDueDateId",
  loanAccountId: ":loanAccountId",
  loanAccountTransactionId: ":loanAccountTransactionId",
  loanDepositId: ":loanDepositId",
  loanId: ":loanId",
  loanPaymentId: ":loanPaymentId",
  priceSheetId: ":priceSheetId",
  userId: ":userId",
  vendorContactId: ":vendorContactId",
  vendorBrandId: ":vendorBrandId",
  vendorId: ":vendorId",
  vendorRequestId: ":vendorRequestId",
};

const root = "";
const loansRoot = `${root}/loans_and_accounts`;

const brandRequestRoot = `${root}/brand_requests`;
const brandListRoot = `${root}/brand_list`;
const reportsRoot = `${root}/reports`;
const brandRoot = `${root}/brands`;
const categoryRoot = `${root}/categories`;
const emailRoot = `${root}/emails`;
const loanAccountDueDateRoot = `${loansRoot}/loan_accounts_due_dates`;
const loanAccountRoot = `${loansRoot}/loan_accounts`;
const loanDepositRoot = `${loansRoot}/loan_deposits`;
const loanPaymentRoot = `${loansRoot}/loan_payments`;
const loanRoot = `${loansRoot}/loans`;
const priceSheetRoot = `${root}/price_sheets`;
const userRoot = `${root}/users`;
const vendorContactRoot = `${root}/vendor_contacts`;
const vendorBrandRoot = `${root}/vendor_brands`;
const vendorRoot = `${root}/vendors`;
const vendorUserRoot = `${root}/vendor_users`;

const vendorUsers = {
  root: vendorUserRoot,
  brands: `${vendorUserRoot}/brands`,
  viewBrand: `${vendorUserRoot}/brands/${linkPlaceholders.vendorRequestId}/view`,
  editBrand: `${vendorUserRoot}/brands/${linkPlaceholders.vendorRequestId}/edit`,
  addBrand: `${vendorUserRoot}/brands/add`,
  openBrands: `${vendorUserRoot}/open_brands`,
};

const brands = {
  root: brandRoot,
  add: `${brandRoot}/add`,
  edit: `${brandRoot}/${linkPlaceholders.brandId}/edit`,
  changeImage: `${brandRoot}/${linkPlaceholders.brandId}/change_image`,
  changeFile: `${brandRoot}/${linkPlaceholders.brandId}/change_file`,
  attachments: `${brandRoot}/${linkPlaceholders.brandId}/attachments`,
  view: `${brandRoot}/${linkPlaceholders.brandId}/view`,
};

const categories = {
  root: categoryRoot,
  add: `${categoryRoot}/add`,
  edit: `${categoryRoot}/${linkPlaceholders.categoryId}/edit`,
};

const loanAccounts = {
  root: loanAccountRoot,
  add: `${loanAccountRoot}/add`,
  edit: `${loanAccountRoot}/${linkPlaceholders.loanAccountId}/edit`,
  view: `${loanAccountRoot}/${linkPlaceholders.loanAccountId}/view`,
  addTransaction: `${loanAccountRoot}/${linkPlaceholders.loanAccountId}/transactions/add`,
  editTransaction: `${loanAccountRoot}/${linkPlaceholders.loanAccountId}/transactions/${linkPlaceholders.loanAccountTransactionId}/edit`,
};

const loanAccountDueDates = {
  root: loanAccountDueDateRoot,
  add: `${loanAccountDueDateRoot}/add`,
  edit: `${loanAccountDueDateRoot}/${linkPlaceholders.loanAccountDueDateId}/edit`,
};

const loans = {
  root: loanRoot,
  add: `${loanRoot}/add`,
  bulkAdd: `${loanRoot}/bulk_add`,
  edit: `${loanRoot}/${linkPlaceholders.loanId}/edit`,
  view: `${loanRoot}/${linkPlaceholders.loanId}/view`,
  addPayment: `${loanRoot}/${linkPlaceholders.loanId}/payments/add`,
  editPayment: `${loanRoot}/${linkPlaceholders.loanId}/payments/${linkPlaceholders.loanPaymentId}/edit`,
  summary: `${loansRoot}/loan_summary`,
};

const loanPayments = {
  root: loanPaymentRoot,
  add: `${loanPaymentRoot}/add`,
  edit: `${loanPaymentRoot}/${linkPlaceholders.loanPaymentId}/edit`,
};

const loanDeposits = {
  root: loanDepositRoot,
  add: `${loanDepositRoot}/add`,
  edit: `${loanDepositRoot}/${linkPlaceholders.loanDepositId}/edit`,
};

const users = {
  root: userRoot,
  add: `${userRoot}/add`,
  edit: `${userRoot}/${linkPlaceholders.userId}/edit`,
};

const priceSheets = {
  root: priceSheetRoot,
  add: `${priceSheetRoot}/add`,
  edit: `${priceSheetRoot}/${linkPlaceholders.priceSheetId}/edit`,
};

const vendors = {
  root: vendorRoot,
  add: `${vendorRoot}/add`,
  edit: `${vendorRoot}/${linkPlaceholders.vendorId}/edit`,
  view: `${vendorRoot}/${linkPlaceholders.vendorId}/view`,
  addUser: `${vendorRoot}/${linkPlaceholders.vendorId}/add_user`,
};

const vendorContacts = {
  root: vendorContactRoot,
  add: `${vendorContactRoot}/add`,
  edit: `${vendorContactRoot}/${linkPlaceholders.vendorContactId}/edit`,
};

const vendorBrands = {
  root: vendorBrandRoot,
  add: `${vendorBrandRoot}/add`,
  edit: `${vendorBrandRoot}/${linkPlaceholders.vendorBrandId}/edit`,
};

const brandRequests = {
  root: brandRequestRoot,
  vendorRequests: `/vendor_requests`,
  bulkImport: `/brand_request_bulk_import`,
  deleted: `/deleted_brand_requests`,
  add: `${brandRequestRoot}/add`,
  edit: `${brandRequestRoot}/${linkPlaceholders.brandRequestId}/edit`,
  view: `${brandRequestRoot}/${linkPlaceholders.brandRequestId}/view`,
};

const brandList = {
  root: brandListRoot,
  add: `${brandListRoot}/add`,
  edit: `${brandListRoot}/${linkPlaceholders.brandListId}/edit`,
};

const report = {
  root: reportsRoot,
};

const emails = {
  root: emailRoot,
};

const routing = {
  brandRequests,
  brandList,
  brands,
  categories,
  emails,
  home: `${root}/home`,
  loanAccountDueDates,
  loanAccounts,
  loanDeposits,
  loanPayments,
  loans,
  loansRoot,
  priceSheets,
  root,
  users,
  vendorContacts,
  vendorBrands,
  vendors,
  vendorUsers,
  reset: "/reset",
  report
};

const navLinks = {
  brandsForAdmin: [
    { name: "View", link: generateLinkWithParams(brands.view) },
    { name: "Edit", link: generateLinkWithParams(brands.edit) },
  ],
  brands: [{ name: "View", link: generateLinkWithParams(brands.view) }],
  categories: [{ name: "Edit", link: generateLinkWithParams(categories.edit) }],
  users: [{ name: "Edit", link: generateLinkWithParams(users.edit) }],
  vendors: [
    { name: "View", link: generateLinkWithParams(vendors.view) },
    { name: "Edit", link: generateLinkWithParams(vendors.edit) },
  ],
  loans: [
    { name: "View", link: generateLinkWithParams(loans.view), icon: <HiEye /> },
    {
      name: "Edit",
      link: generateLinkWithParams(loans.edit),
      icon: <FaEdit />,
    },
  ],
  loanPayments: [
    {
      name: "Edit",
      link: generateLinkWithParams(loanPayments.edit),
      icon: <FaEdit />,
    },
  ],
  loanDeposits: [
    {
      name: "Edit",
      link: generateLinkWithParams(loanDeposits.edit),
      icon: <FaEdit />,
    },
  ],
  loanAccounts: [
    {
      name: "View",
      link: generateLinkWithParams(loanAccounts.view),
      icon: <HiEye />,
    },
    {
      name: "Edit",
      link: generateLinkWithParams(loanAccounts.edit),
      icon: <FaEdit />,
    },
  ],
  loanAccountDueDates: [
    {
      name: "Edit",
      link: generateLinkWithParams(loanAccountDueDates.edit),
      icon: <FaEdit />,
    },
  ],
  loanAccountTransactions: [
    {
      name: "Edit",
      link: generateLinkWithParams(loanAccounts.editTransaction),
      icon: <FaEdit />,
    },
  ],
  vendorContacts: [
    { name: "Edit", link: generateLinkWithParams(vendorContacts.edit) },
  ],
  vendorBrands: [
    { name: "Edit", link: generateLinkWithParams(vendorBrands.edit) },
  ],
  brandRequests: (isSourcingAdmin) => [
    { name: "View", link: generateLinkWithParams(brandRequests.view) },
    ...(isSourcingAdmin
      ? [{ name: "Edit", link: generateLinkWithParams(brandRequests.edit) }]
      : []),
  ],
};

const sideNav = ({
  isPriceSheetsUser,
  isSourcingUser,
  isSourcingAdmin,
  isAdmin,
  isSourcingUserOnly,
  isLoansAdmin,
  isLoansUser,
  isBrandListUser,
  isVendorUser,
  brandRequests = [],
}) => [
  {
    name: "Brands",
    sub: [
      {
        name: "Brand List",
        link: routing.brandList.root,
        show: isBrandListUser,
      },
      {
        name: "Price Sheets",
        link: routing.brands.root,
        show: isPriceSheetsUser,
      },
    ],
    show: isBrandListUser || isPriceSheetsUser,
  },
  {
    name: "Sourcing",
    sub: [
      {
        name: isSourcingUserOnly ? "Request a Brand" : "Brands",
        link: routing.brandRequests.root,
        show: true,
      },
      {
        name: "Reports",
        link: routing.report.root,
        show: isSourcingAdmin,
      },
      {
        name: "Vendors",
        link: routing.vendors.root,
        show: isSourcingAdmin,
      },
      {
        name: "All Vendor Requests",
        link: routing.brandRequests.vendorRequests,
        show: isSourcingAdmin,
      },
      {
        name: "Vendor Contacts",
        link: routing.vendorContacts.root,
        show: isSourcingAdmin,
      },
      {
        name: "Bulk Import",
        link: routing.brandRequests.bulkImport,
        show: isSourcingAdmin,
      },
      {
        name: "Sent Emails",
        link: routing.emails.root,
        show: isSourcingAdmin,
      },
      {
        name: "Deleted Brands",
        link: routing.brandRequests.deleted,
        show: isSourcingAdmin,
      },
    ],
    show: isSourcingUser,
  },
  {
    name: "Loans",
    sub: [
      {
        name: "Summary",
        link: routing.loans.summary,
        show: isLoansAdmin,
      },
      {
        name: "Loans",
        link: routing.loans.root,
        show: true,
      },
      {
        name: "Payments",
        link: routing.loanPayments.root,
        show: true,
      },
      {
        name: "Deposits",
        link: routing.loanDeposits.root,
        show: true,
      },
    ],
    show: isLoansUser,
  },
  {
    name: "Loan Accounts",
    sub: [
      {
        name: "Accounts",
        link: routing.loanAccounts.root,
        show: true,
      },
      {
        name: "Due Dates",
        link: routing.loanAccountDueDates.root,
        show: true,
      },
    ],
    show: isLoansUser,
  },
  {
    name: "Vendors",
    sub: [
      {
        name: `New Brands (${
          brandRequests.filter((br) => !isRequestOpen(br)).length
        })`,
        link: routing.vendorUsers.brands,
        show: true,
      },
      {
        name: `Open Brands (${brandRequests.filter(isRequestOpen).length})`,
        link: routing.vendorUsers.openBrands,
        show: true,
      },
    ],
    show: isVendorUser,
  },
  {
    name: "Admin",
    sub: [
      {
        name: "Categories",
        link: routing.categories.root,
        show: true,
      },
      {
        name: "Users",
        link: routing.users.root,
        show: true,
      },
      {
        name: "Price Sheet Vendors",
        link: routing.vendorBrands.root,
        show: isSourcingAdmin,
      },
    ],
    show: isAdmin,
  },
];

const brandRequestStatusObject = {
  Unworked: { value: "Unworked", label: "Unworked" },
  WorkedOn: { value: "WorkedOn", label: "Worked On" },
  Requested: { value: "Requested", label: "Requested" },
  InProcess: { value: "InProcess", label: "In Process" },
  InActive: { value: "InActive", label: "In Active" },
  Open: { value: "Open", label: "Open" },
  Ordered: { value: "Ordered", label: "Ordered" },
  Closed: { value: "Closed", label: "Closed" },
  NoneAvailability: { value: "NoneAvailability", label: "None Availability" },
  Denied: { value: "Denied", label: "Denied" },
  AlreadyOnTheMarket: {
    value: "AlreadyOnTheMarket",
    label: "Already On The Market",
  },
  FollowUp: { value: "FollowUp", label: "Follow Up" },
  VendorCreated: { value: "VendorCreated", label: "VendorCreated" },
};

const allBrandRequestStatuses = Object.values(brandRequestStatusObject).map(
  (status) => status.value
);

const brandClassObject = {
  A: { value: "A", label: "A" },
  B: { value: "B", label: "B" },
  C: { value: "C", label: "C" },
  D: { value: "D", label: "D" },
};

const allBrandClasses = Object.values(brandClassObject).map(
  (_class) => _class.value
);

const brandClassDropdownList = Object.values(brandClassObject).map(
  (_class) => _class
);

export {
  allBrandRequestStatuses,
  brandRequestStatusObject,
  generateLinkWithParams,
  linkPlaceholders,
  localStorageKeys,
  navLinks,
  routing,
  sideNav,
  brandClassObject,
  allBrandClasses,
  brandClassDropdownList,
};
