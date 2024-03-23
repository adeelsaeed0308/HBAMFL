import { brandRequestStatusObject } from "./config";

const getSourcingStatusList = (brandRequests = []) => {
  const values = Object.values(brandRequestStatusObject).map((o) => ({
    ...o,
    ids: {},
  }));
  for (const brand of brandRequests) {
    const { value: _id, statuses } = brand
    for (const status of statuses) {
      const valueObject = values.find((v) => v.value === status);
      if (valueObject&&brand.isAccepted) {
        valueObject.ids[_id] = _id;
      }
    }
  }
  const indexOfVendorCreated = values.findIndex(e=>e.value=='VendorCreated')
  for(let brand of brandRequests){
    if(brand.isAccepted === false){
      values[indexOfVendorCreated].ids[brand.value] = brand.value
    }
  }
  return values.map((v) => ({ ...v, total: Object.values(v.ids).length }));
};

const loanPOPrefix = "PO-";
const loanSOPrefix = "SO-";

export { getSourcingStatusList, loanPOPrefix, loanSOPrefix };
