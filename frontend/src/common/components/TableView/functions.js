import { CheckmarkOutline } from "@carbon/icons-react";
import { formatNumber } from "common/functions";
import { format } from "date-fns";

const renderElement = ({ value, isDateTime, isCurrency, isDate, isHtml }) =>
  value === null || value === undefined ? (
    "-- -- -- --"
  ) : isDateTime ? (
    format(new Date(value), "MMM dd, yyyy HH:mm")
  ) : isDate && value ? (
    format(new Date(value), "MMM dd, yyyy")
  ) : typeof value === "boolean" ? (
    value ? (
      <CheckmarkOutline />
    ) : null
  ) : isCurrency ? (
    `$${formatNumber(value, true)}`
  ) : isHtml ? (
    <div dangerouslySetInnerHTML={{ __html: value }} />
  ) : (
    value
  );

export { renderElement };
