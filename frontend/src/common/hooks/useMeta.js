import {
  convertListToKeyValuePair,
  sortAndFormatOptions,
} from "common/functions";
import { orderBy } from "lodash";
import { useAxios } from "../axios";

const sortLists = (a, b) =>
  a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;

const useCountries = () => {
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: "/data/allCountries" },
  });

  const countries = response
    ? response.data.sort().map((label) => ({
        label,
        value: label,
      }))
    : [];

  return countries;
};

const useCurrencies = () => {
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: "/data/allCurrencies" },
  });

  const currencyOptions = response
    ? response.data.map(({ code: value, description, symbol }) => ({
        value,
        label: `${symbol} ${description} (${value})`,
      }))
    : [];

  return { currencies: response ? response.data : [], currencyOptions };
};

const useCategories = () => {
  const {
    response,
    refetch: reloadCategories,
    loading,
  } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/categories",
      params: { limit: 1000000 },
    },
  });

  const categories = response
    ? response.data.data.sort(sortLists).map((category) => ({
        label: category?.name,
        value: category.id,
      }))
    : [];

  return { reloadCategories, categories, loading };
};

const useLoanAccounts = () => {
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/loanAccounts",
      params: { limit: 1000000 },
    },
  });

  const loanAccounts = response
    ? response.data.data.sort(sortLists).map((la) => ({
        label: la.name,
        value: la.id,
      }))
    : [];

  return loanAccounts;
};

const useLoans = () => {
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/loans",
      params: { limit: 1000000 },
    },
  });

  const loans = response
    ? orderBy(response.data.data, ["loanNumber"], ["asc"]).map((l) => ({
        label: l.loanNumber,
        value: l.id,
      }))
    : [];

  return loans;
};

const useLoanBrands = () => {
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/loans",
      params: { limit: 1000000 },
    },
  });

  const brands = [
    ...new Set(
      response?.data.data.map((loan) => loan.brand).filter(Boolean) || []
    ),
  ];

  return brands;
};

const useUsers = (getObject = false) => {
  const { response } = useAxios({
    alertError: false,
    callOnLoad: {
      method: "GET",
      url: "/users",
      params: { limit: 1000000 },
    },
  });

  if (getObject) {
    return response ? convertListToKeyValuePair(response.data.data) : {};
  }

  return response
    ? response.data.data.sort(sortLists).map((user) => ({
        label: user.name,
        value: user.id,
      }))
    : [];
};

const useVendors = () => {
  const { response } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendors",
      params: { limit: 1000000, populate: "contacts" },
    },
  });

  const vendors = response
    ? response.data.data.sort(sortLists).map((vendor) => ({
        ...vendor,
        label: vendor.name,
        value: vendor.id,
      }))
    : [];

  return vendors;
};

const useBrandRequests = () => {
  const { response, loading, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/brandRequests",
      params: { limit: 1000000 },
    },
  });

  const brandRequests = response
    ? response.data.data
        .sort((a, b) =>
          a.brandName.toLowerCase() < b.brandName.toLowerCase() ? -1 : 1
        )
        .map((brandRequest) => ({
          label: brandRequest.brandName,
          value: brandRequest.id,
          status: brandRequest.status,
          isAccepted: brandRequest.isAccepted,
          statuses: brandRequest.statuses,
          isPinned: brandRequest.isPinned,
        }))
    : [];

  return { brandRequests, loading, refetch };
};

const useVendorRequestsStatusChanges = () => {
  const { response, loading, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/vendorRequests/all/statusChanges",
      params: { limit: 1000000 },
    },
  });

  const statusChanges = response
    ? response.data.data.map((statusChange) => ({
        ...statusChange,
      }))
    : [];

  return { statusChanges, refetch };
};

const useVendorRequestsStatusChangesNDaysNoChange = (n) => {
  const { response, loading, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/vendorRequests/all/statusChanges/nDaysNoChange/${n}`,
      params: { limit: 1000000 },
    },
  });

  const records = response
    ? response.data.data.map((record) => ({
        ...record,
      }))
    : [];

  return { records, refetch };
};

const useBrands = () => {
  const { response, loading, refetch } = useAxios({
    callOnLoad: {
      method: "GET",
      url: "/brands",
      params: { limit: 1000000 },
    },
  });

  const brands = response
    ? response.data.data
        .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
        .map((brand) => ({
          label: brand.name,
          value: brand.id,
        }))
    : [];

  return { brands, loading, refetch };
};

const usePrevEmails = () => {
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: "/emails/autocomplete" },
  });

  return sortAndFormatOptions({
    list: response?.data || [],
    valueKey: (l) => l,
    labelKey: (l) => l,
  });
};

export {
  useBrandRequests,
  useCategories,
  useCountries,
  useCurrencies,
  useLoanAccounts,
  useLoanBrands,
  useLoans,
  usePrevEmails,
  useUsers,
  useVendors,
  useBrands,
  useVendorRequestsStatusChanges,
  useVendorRequestsStatusChangesNDaysNoChange
};
