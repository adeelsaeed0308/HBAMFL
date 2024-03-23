const { useNavigate } = require("react-router-dom");

const useGoBack = () => {
  const navigate = useNavigate();
  return (route) => {
    if (route && typeof route === "string") {
      navigate(route);
    } else {
      navigate(-1);
    }
  };
};

export default useGoBack;
