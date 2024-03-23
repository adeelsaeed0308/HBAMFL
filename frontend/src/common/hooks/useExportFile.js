const { useAxios } = require("common/axios");
const { downloadFile } = require("common/functions");

const useExportFile = (filename, url, onComplete) => {
  
  const { callAxios: exportFile, loading: exportLoading } = useAxios({
    onComplete: ({ data: excelFile }) => {
      onComplete
        ? onComplete(excelFile)
        : downloadFile(
          excelFile,
          filename +
          " - " +
          new Date().toLocaleDateString().replaceAll("/", "-") +
          ".xlsx"
          );
    },
  });

  const getThisFile = (params) =>
    exportFile({
      method: "GET",
      responseType: "blob",
      url,
      params,
    });

  return { exportLoading, getThisFile, exportFile };
};

export default useExportFile;
