import { orderBy } from "lodash";
import styled from "styled-components";
import { baseURL } from "./axios";
import { brandRequestStatusObject } from "./config";

const isMissing = (name = "Name") => `${name} is Missing`;

const addPointerToIcon = (Icon) => styled(Icon)`
  cursor: pointer;
`;

const downloadFile = (file, filename = "Sample.xlsx") => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
};

const openNewTab = (href = "") => {
  const a = document.createElement("a");
  a.target = "_blank";
  a.href = href;
  a.click();
  a.remove();
};

const fetchImage = (filename = "") => `${baseURL}/files/${filename}`;
const getApiPath = (route = "") => `${baseURL}/${route}`;
const getFilename = (filename = "") => filename.split("__")?.[2] || "";

const sortAndFormatOptions = ({
  list = [],
  valueKey = "id",
  labelKey = "name",
}) => {
  return orderBy(
    list.map((item) => ({
      value: typeof valueKey === "function" ? valueKey(item) : item[valueKey],
      label: typeof labelKey === "function" ? labelKey(item) : item[labelKey],
    })),
    [(item) => item.label.toLowerCase()],
    ["asc"]
  );
};

const getContactLabel = (contact) => `${contact.name} (${contact.email})`;

const convertListToKeyValuePair = (
  list = [],
  idKey = "id",
  valueKey = "name"
) =>
  list.reduce((acc, item) => ({ ...acc, [item[idKey]]: item[valueKey] }), {});

const formatNumber = (number, showZero = true) => {
  if (number) {
    return Intl.NumberFormat().format(+number);
  }
  return showZero ? 0 : "";
};

const getSite = () => process.env.REACT_APP_SITE || "WorkPortal";
const isKanda = () => getSite() === "KANDA";

const isRequestOpen = (request) =>
  ["Open", "Ordered", "Closed", "InActive"].includes(request?.status);

const getButtonStyleForVendorBrandRequestStatus = (status) => {
  let buttonStyle = {
    color: "white",
    backgroundColor: "#F44336", // Default color
  };

  switch (status) {
    case brandRequestStatusObject.Unworked.value:
      buttonStyle.backgroundColor = "#F44336"; // Red
      break;
    case brandRequestStatusObject.Requested.value:
      buttonStyle.backgroundColor = "#9da832"; // Mustard
      break;
    case brandRequestStatusObject.InProcess.value:
      buttonStyle.backgroundColor = "#CC7722"; // Ochere
      break;
    case brandRequestStatusObject.InActive.value:
      buttonStyle.backgroundColor = "#b37e49";
      break;
    case brandRequestStatusObject.Open.value:
      buttonStyle.backgroundColor = "#2196F3"; // Blue
      break;
    case brandRequestStatusObject.Ordered.value:
      buttonStyle.backgroundColor = "#673AB7"; // Purple
      break;
    case brandRequestStatusObject.Closed.value:
      buttonStyle.backgroundColor = "#009688"; // Teal
      break;
    case brandRequestStatusObject.NoneAvailability.value:
      buttonStyle.backgroundColor = "#FF9800"; // Orange
      break;
    case brandRequestStatusObject.Denied.value:
      buttonStyle.backgroundColor = "#795548"; // Brown
      break;
    case brandRequestStatusObject.AlreadyOnTheMarket.value:
      buttonStyle.backgroundColor = "#3F51B5"; // Indigo
      break;
    case brandRequestStatusObject.VendorCreated.value:
      buttonStyle.backgroundColor = "#8BC34A"; // Light Green
      break;
    case brandRequestStatusObject.FollowUp.value:
      buttonStyle.backgroundColor = "#FF5722"; // Deep Orange
      break;
    case brandRequestStatusObject.WorkedOn.value:
      buttonStyle.backgroundColor = "#4CAF50"; // Green
      break;
    default:
      // Keep the default color
      break;
  }

  return buttonStyle;
};

const htmlToPlainText = (html) => {
  return new DOMParser().parseFromString(html, "text/html").documentElement
    .textContent;
};

export {
  getSite,
  addPointerToIcon,
  formatNumber,
  downloadFile,
  fetchImage,
  getApiPath,
  isMissing,
  openNewTab,
  sortAndFormatOptions,
  getContactLabel,
  convertListToKeyValuePair,
  isKanda,
  getFilename,
  isRequestOpen,
  getButtonStyleForVendorBrandRequestStatus,
  htmlToPlainText
};
