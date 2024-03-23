/* eslint-disable react-hooks/exhaustive-deps */
import { TableSortLabel } from "@mui/material";
import {
  CollapsibleHeader,
  TableView,
  fetchImage,
  useAxios,
  useExportFile,
  useLoginContext,
  useUploadFile,
} from "common";
import React, { useEffect, useState } from "react";

const Vendors = ({ id }) => {
  const { isAdmin } = useLoginContext();
  const [show, setShow] = useState(false);
  const [brand, setBrand] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const { callAxios } = useAxios();

  const adminProps = isAdmin;

  const { uploadFile } = useUploadFile();

  const { getThisFile } = useExportFile(
    "PriceSheet",
    `/vendors/${selectedFileId}/brands/export`
  );

  useEffect(() => {
    callAxios({
      method: "GET",
      url: `/brands/${id}`,
    }).then((data) => setBrand(data.data));
  }, [id]);

  const setAsMainVendor = (id, brandId, reloadTable) => {
    brand?.defaultVendorId !== id &&
      callAxios({
        method: "PUT",
        url: `/brands/${brandId}`,
        data: { defaultVendorId: id },
      }).then((data) => {
        setBrand(data.data);
        reloadTable();
      });
  };

  const onFileClick = (fileId) => {

  };

  const [pricesheet, setPricesheet] = useState([]);

  const fileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.files = null;
    e.target.value = null;
    if (!file) return;
    uploadFile(file)
      .then(({ data: { filename } }) => {
        return filename;
      })
      .then((filename) => {
        callAxios({
          url: `/vendors/${e.id}/brand/${brand.id}/priceSheetDetails`,
          method: "PUT",
          data: {
            attachments: [filename],
          },
        }).then(e.reloadTable);
        return filename;
      })
      .then((filename) => {
        setPricesheet((prev) => [...prev, filename]);
      });
  };

  const fileDelete = ({ id, filename, reloadTable }) => {
    callAxios({
      url: `/vendors/${id}/brand/${brand.id}/priceSheetDetails`,
      method: "PUT",
      data: {
        attachments: [],
      },
    }).then(reloadTable);

    callAxios({
      method: "DELETE",
      url: `/files/${filename}`,
    });
  };

  return (
    <div>
      <CollapsibleHeader header="Vendors" show={show} setShow={setShow} />
      {show && (
        <TableView
          defaultAction={() => {}}
          url="/vendors"
          tableConfig={[
            {
              name: "name",
              header: "Name",
            },
            {
              name: "brandPriceSheets",
              header: "Files",
              isVendorPriceSheet: true,
              brandId: brand.id,
              pricesheets: pricesheet,
              uploadFile: fileUpload,
              deleteFile: fileDelete,
            },
            {
              name: "order",
              header: "Order",
            },
            {
              header: "Main",
              defaultVendorId: brand?.defaultVendorId,
              isVendorPriceSheet: true,
              brandId: brand.id,
              action: setAsMainVendor,
            },
          ]}
          header="Vendors"
          pricesheet={pricesheet}
          {...adminProps}
        />
      )}
    </div>
  );
};

export default Vendors;
