const { useAxios } = require("common/axios");

const useDeleteFile = () => {
  const { callAxios, loading: deleting } = useAxios();

  const deleteFile = async (file) => {
    if (!file) return;
    return callAxios({
      method: "DELETE",
      url: `/files/${file}`,
      headers: {
        "Content-Type": "blob",
      },
    });
  };

  return { deleteFile, deleting };
};

export default useDeleteFile;
