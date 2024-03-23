import {
  linkPlaceholders,
  navLinks,
  routing,
  TableView,
  useCategories,
  useLoginContext,
  Button,
  useExportFile,
  DropdownButton,
  useAxios
} from "common";
import React, { useState, useEffect } from "react";


const ExportButton = () => {
  const { getThisFile, exportLoading } = useExportFile('PriceSheets', `/brands/exportPricesheets`);
  return <Button loading={exportLoading} onClick={() => getThisFile()}>Export</Button>
}

const BulkImport = ({isModalOpen, setIsModalOpen}) => {
  const { getThisFile } = useExportFile('Bulk import sample', `/brands/bulkSample`);
  const options = [
    <div key="downloadSample" onClick={() => getThisFile()} >
      Download Sample
    </div>,
    <div onClick={() => setIsModalOpen(!isModalOpen)} key="uploadFile">
    Upload file
  </div>,
  ]

  return <DropdownButton
    secondary
    fit
    options={options}
  >Bulk Import</DropdownButton>
}

const ModalWindow = ({isModalOpen, setIsModalOpen, file , setFile}) => {
  const {callAxios} = useAxios();
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    if(file) {
      setFormData(prev => {
        prev.set("file", file, "Bulk import.xlsx")
        return prev;
      })
    }
  } ,[file])

  return(
    <div onClick={() => setIsModalOpen(!isModalOpen)} 
      style={{
        display: "flex", 
        height: "100vh", 
        width: "100%", 
        position: "fixed", 
        top: 0, 
        right: 0, 
        bottom: 0, 
        left: 0, 
        backgroundColor: "#0000007e", 
        zIndex: 5, 
        justifyContent: "center", 
        alignItems:"center"
        }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'white', 
        height: 75,
        padding: 25,
        display: "flex",
        alignItems: "center",
        justifyContent:"center",
        gap: 50
        }}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file"/>
        <div><Button onClick={() => {
          callAxios({
          method: "PUT",
          url: "/brands/bulk/update",
          data: formData
        }).finally(() => setIsModalOpen(!isModalOpen))}}>Submit</Button></div>
      </div>
    </div>
  )
}

const BrandList = () => {
  const { isPriceSheetsAdmin } = useLoginContext();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const adminProps = isPriceSheetsAdmin
    ? {
        deleteUrl: (id) => `/brands/${id}`,
        deleteMessage: (brand) => `Delete ${brand.name}`,
        actionLink: routing.brands.add,
        actionName: "Add Brand",
      }
    : {};
  const { categories } = useCategories();
  const filterConfig = [
    {
      name: "category",
      type: "dropdown",
      options: categories,
      label: "Filter By Category",
    },
    {
      name: "name",
      type: "input",
      label: "Search",
    },
  ];
  return (
    <>
      {
        isModalOpen && <ModalWindow setFile={setFile}  file={file} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}/>
      }
      <TableView
        url="/brands"
        tableConfig={[
          {
            name: "name",
            header: "Name",
          },
          {
            name: "lastModifiedPricesheet",
            header: "Items Modified",
            isDate: true,
          },
          {
            name: "pricesheets",
            header: "Pricesheets",
            center: true,
          },
          {
            name: "lastUploadedBy",
            header: "Last Uploaded By",
          },
        ]}
        navLinks={navLinks[isPriceSheetsAdmin ? "brandsForAdmin" : "brands"]}
        linkParam={linkPlaceholders.brandId}
        header="Brands"
        filterConfig={filterConfig}
        {...adminProps}
        additionalActions={[<ExportButton key='exportButton' />, <BulkImport setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}/>]}
        shapeData={(d) =>
          d.data.data.map((brand) => ({
            ...brand,
            pricesheets: (brand.pricesheets?.length || 0) + 1,
            lastUploadedBy: brand.lastUploadedBy?.name,
          }))
        }
        defaultFilters={{ brand: { $exists: false } }}
        defaultParams={{ populate: "pricesheets lastUploadedBy" }}
      />
    </>
  );
};

export default BrandList;
