const { useAxios } = require("common/axios");

const useUploadFile = () => {
  const { callAxios, loading: uploadLoading } = useAxios();

  const uploadFile = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    return callAxios({
      method: "POST",
      url: `/files/upload`,
      data,
      headers: {
        "Content-Type": "blob",
      },
    });
  };

  return { uploadFile, uploadLoading };
};

export default useUploadFile;
