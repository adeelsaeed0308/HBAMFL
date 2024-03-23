import { CollapsibleHeader } from "common";
import React, { useState } from "react";

const Notes = ({ brand }) => {
  const [show, setShow] = useState(false);
  console.log(brand);
  return (
    <>
      <CollapsibleHeader header="Notes" show={show} setShow={setShow} />
      {show && (
        <>
          <h5>Fob Point</h5>
          <p>{brand?.fobPoint || "---"}</p>
          <h5>Lead Time</h5>
          <p>{brand?.leadTime || "---"}</p>
          <h5>Special Discount Notes</h5>
          <p>{brand?.specialDiscountNotes || "---"}</p>
          <h5>Notes</h5>
          <p>{brand?.notes || "---"}</p>
        </>
      )}
    </>
  );
};

export default Notes;
