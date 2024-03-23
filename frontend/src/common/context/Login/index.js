import { useAxios } from "common/axios";
import { FullPageLoad } from "common/components";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useToast } from "../Toast";

const LoginContext = React.createContext({
  currentUser: undefined,
  isAdmin: false,
  isPriceSheetsUser: false,
  isPriceSheetsAdmin: false,
  isSourcingUser: false,
  isSourcingAdmin: false,
  isSourcingUserOnly: false,
  isBrandListUser: false,
  isBrandListAdmin: false,
  isVendorUser: false,
  clearCurrentUser: () => {},
  brandRequests: [],
  updateBrandRequests:()=>{}
});

const checkAdmin = (key) => key === "Admin";

const LoginProvider = ({ children }) => {
  const [brandRequests, setBrandRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const { callAxios, callCount } = useAxios({
    onComplete: (res) => {
      setCurrentUser(res.data);
    },
    alertError: false,
  });
  const { callAxios: getBrandRequests } = useAxios();
  const isVendorUser = !!currentUser?.vendorRole;
  const vendor = currentUser?.vendor;

  useEffect(() => {
    if (isVendorUser && vendor) {
      getBrandRequests({
        url: `/vendors/${vendor}`,
        method: "GET",
        params: {
          populate: { path: "vendorRequests" },
        },
      }).then(({ data }) => {
        setBrandRequests(data.vendorRequests || []);
      });
    } else {
      setBrandRequests([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVendorUser, vendor]);

  const clearCurrentUser = () => {
    setCurrentUser();
  };

 const updateBrandRequests = useCallback((vendorId) => {
    getBrandRequests({
      url: `/vendors/${vendorId}`,
      method: "GET",
      params: {
        populate: { path: "vendorRequests" },
      },
    }).then( ({ data }) => {
      setBrandRequests(data.vendorRequests || []);
    })
 }, [])
  const { onError } = useToast();

  const fetchUser = useCallback(() => {
    callAxios({
      url: "/auth/me",
    }).catch((e) => {
      if (e?.message?.toLowerCase() === "cannot login on this site") {
        onError(e);
      }
    });
  }, [callAxios, onError]);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (callCount === 0) return <FullPageLoad />;

  const isAdmin = currentUser?.admin;
  const isBrandListAdmin = isAdmin || checkAdmin(currentUser?.brandListRole);
  const isBrandListUser = isAdmin || !!currentUser?.brandListRole;
  const isSourcingAdmin = isAdmin || checkAdmin(currentUser?.sourcingRole);
  const isSourcingUser = isAdmin || !!currentUser?.sourcingRole;
  const isLoansAdmin = isAdmin || checkAdmin(currentUser?.loansRole);
  const isLoansUser = isAdmin || !!currentUser?.loansRole;

  return (
    <LoginContext.Provider
      value={{
        clearCurrentUser,
        fetchUser,
        currentUser,
        isAdmin,
        isPriceSheetsAdmin: isAdmin || checkAdmin(currentUser?.priceSheetsRole),
        isPriceSheetsUser: isAdmin || !!currentUser?.priceSheetsRole,
        isSourcingAdmin,
        isSourcingUser,
        isSourcingUserOnly: isSourcingUser && !isSourcingAdmin && !isAdmin,
        isLoansAdmin,
        isLoansUser,
        isLoansUserOnly: isLoansUser && !isLoansAdmin && !isAdmin,
        isBrandListAdmin,
        isBrandListUser,
        isBrandListUserOnly: isBrandListUser && !isBrandListAdmin && !isAdmin,
        isVendorUser,
        brandRequests,
        updateBrandRequests
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

const useLoginContext = () => useContext(LoginContext);

export { LoginContext, LoginProvider, useLoginContext };
