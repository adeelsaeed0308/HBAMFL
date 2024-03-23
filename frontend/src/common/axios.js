import axios from "axios";
import { getIn } from "formik";
import { useEffect, useState } from "react";
import { useToast } from "./context/Toast";

const baseURL = `${
  process.env.REACT_APP_SERVER_URL || "http://localhost:5001/"
}api`;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.headers["X-Livigent-Modified"] === "blocked") {
      alert(
        "Request has been blocked by filter: " +
          (response.config.baseURL || "") +
          response.config?.url
      );
    }
    return response;
  },
  (error) => {
    if (
      error?.response?.status === 401 &&
      error?.config?.url !== "/auth/me" &&
      window.location.pathname !== "/"
    ) {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const getCorrectError = (errorObject) => {
  if (Array.isArray(errorObject)) {
    return errorObject.map((errMap) => errMap.message).join(", ");
  }
  return getIn(errorObject, "message");
};

const useAxios = (
  {
    onComplete = () => {},
    onError = () => {},
    alertError = true,
    alertSuccess = "",
    callOnLoad,
  } = {
    onComplete: () => {},
    onError: () => {},
    alertError: true,
    alertSuccess: "",
  }
) => {
  const { onError: toastError, alertSuccess: toastSuccess } = useToast();
  const [callCount, setCallCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [response, setResponse] = useState();
  const callAxios = async ({
    url,
    method,
    data,
    params,
    responseType = "application/json",
    headers,
    clearResponse = true,
  }) => {
    if (!url) return;
    setError();
    clearResponse && setResponse();
    setLoading(true);
    return axiosInstance({
      url,
      method,
      data,
      params,
      responseType,
      withCredentials: true,
      headers,
    })
      .then((res) => {
        setResponse(res);
        onComplete(res);
        alertSuccess && toastSuccess(alertSuccess);
        return res;
      })
      .catch(async (e) => {
        let realMessage = "";
        if (getIn(e, "response.data") instanceof Blob) {
          const resultJson = JSON.parse(await e.response.data.text());
          const errorObject = getIn(resultJson, "error");
          realMessage = getCorrectError(errorObject);
        } else {
          const errorObject = getIn(e, "response.data.error");
          realMessage = getCorrectError(errorObject);
        }
        const err = realMessage ? new Error(realMessage) : e;
        setError(err);
        onError(err);
        alertError && toastError(err);
        throw err;
      })
      .finally(() => {
        setLoading(false);
        setCallCount((prev) => prev + 1);
      });
  };

  const col = JSON.stringify(callOnLoad);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col]);

  const refetch = () => {
    if (callOnLoad) {
      callAxios(callOnLoad);
    }
  };

  return { callAxios, loading, error, response, setResponse, callCount, refetch };
};

export { useAxios, baseURL, axiosInstance };
