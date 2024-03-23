import { FullPageLoad, useAxios, useLoginContext } from "common";
import React, { createContext, useContext, useState } from "react";

const VendorContext = createContext({
  vendor: undefined,
  refetchVendor: () => {},
  vendorLoading: false,
});

const VendorProvider = ({ children }) => {
  const { currentUser } = useLoginContext();
  const [vendor, setVendor] = useState();
  const { refetch: refetchVendor, loading } = useAxios({
    callOnLoad: {
      method: "GET",
      url: `/vendors/${currentUser?.vendor}`,
      params: {
        populate: {
          path: "vendorRequests",
          populate: [
            { path: "brandRequest", populate: "category" },
            "requestBy",
          ],
        },
      },
    },
    onComplete: (res) => setVendor(res.data),
  });

  if (!vendor) return <FullPageLoad fillWidth />;

  return (
    <VendorContext.Provider
      value={{ vendor, refetchVendor, vendorLoading: loading }}
    >
      {children}
    </VendorContext.Provider>
  );
};

const useVendorUserVendor = () => useContext(VendorContext);

export { VendorProvider, useVendorUserVendor };
