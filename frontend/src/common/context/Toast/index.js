import React, { useContext, useEffect, useState } from "react";
import { theme } from "../ThemeProvider";
import { Container } from "./styles";

const ToastContext = React.createContext();

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState();

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(), 8000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [toast]);
  return (
    <ToastContext.Provider value={{ setToast }}>
      <Container toast={toast} color={toast && theme.colors[toast.type]}>
        {toast && toast.message}
      </Container>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const { setToast } = useContext(ToastContext);
  const alertSuccess = (message) => setToast({ type: "success", message });
  const alertError = (message) => setToast({ type: "danger", message });
  const onError = (e) => setToast({ type: "danger", message: e.message });
  return { alertSuccess, alertError, onError };
};

export { ToastProvider, useToast };
