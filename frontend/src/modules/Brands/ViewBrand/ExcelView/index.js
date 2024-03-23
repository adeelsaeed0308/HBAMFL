import { baseURL, Spinner, useAxios, useExportFile } from "common";
import React from "react";
import { Container, Viewer, DownloadButton, DownloadLink, ButtonsWrapper } from "./styles";

const ExcelView = ({ brand, params }) => {
  const { response } = useAxios({
    callOnLoad: { method: "GET", url: "/auth/me/token" },
  });
  const { getThisFile, exportLoading } = useExportFile(brand?.name || "BrandItems", `/brands/${brand.id}/download`);

  if (response) {
    const payload = { token: response.data, ...params };
    const url = `${baseURL}/brands/${
      brand.id
    }/download?payload=${JSON.stringify(payload)}`;
    const src = `https://view.officeapps.live.com/op/view.aspx?src=${url}`;
    //can't just make normal query string because anything beyond the token
    //goes to the view.officeapps.live query params
    return (
      <Container>
        <ButtonsWrapper>
          <DownloadButton  loading={exportLoading} onClick={() => getThisFile(params)}>
            Download
          </DownloadButton>
          <br />
          <DownloadLink to="#" onClick={() => getThisFile({ ...params, skipSalonPrice: true })}>
            Download without Salon Price
          </DownloadLink>
        </ButtonsWrapper>
        <Viewer src={encodeURI(src)} />
      </Container>
    );
  }
  return <Spinner />;
};

export default ExcelView;
