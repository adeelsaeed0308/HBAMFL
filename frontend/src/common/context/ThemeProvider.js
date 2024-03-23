import { isKanda } from "common/functions";
import React from "react";
import { ThemeProvider as SThemeProvider } from "styled-components";

const theme = {
  colors: {
    danger: "#ED172B",
    lightestGrey: "#F2F2F2",
    lighterGrey: "#DBDBDB",
    lightGrey: "#a4a4a4",
    black: "#333333",
    primary: isKanda() ? "pink" : "#ff9696",
    secondary: isKanda() ? "#333333" : "#213236",
    success: "#2A9A4E",
    white: "#FFFFFF",
  },
  breakpointXs: "600px",
  breakpointS: "900px",
  headerHeight: "60px",
};

const ThemeProvider = ({ children }) => {
  return <SThemeProvider theme={theme || {}}>{children}</SThemeProvider>;
};

export { ThemeProvider, theme };
