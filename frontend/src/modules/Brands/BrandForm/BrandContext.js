import React, { createContext, useContext, useState } from "react";

const BrandContext = createContext();

export const useBrandContext = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
  const [overseasChecked, setOverseasChecked] = useState(false);

  // Add any other shared state or functions here

  return (
    <BrandContext.Provider value={{ overseasChecked, setOverseasChecked }}>
      {children}
    </BrandContext.Provider>
  );
};
