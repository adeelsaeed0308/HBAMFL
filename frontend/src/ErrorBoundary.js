import { axiosInstance } from "common";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    axiosInstance.post("/report-frontend-error", {
      message: error.message,
      longMessage: JSON.stringify(error) + JSON.stringify(errorInfo),
      url: document.URL,
    });
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            display: "grid",
            placeContent: "center",
            height: "100vh",
            fontFamily: "cursive",
          }}
        >
          <h2>Oops, there is an error! Tech support has been notified.</h2>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
