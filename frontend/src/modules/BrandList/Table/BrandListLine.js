import {
  fetchImage,
  generateLinkWithParams,
  Link,
  linkPlaceholders,
  routing,
  RowFlex,
  Spinner,
  theme,
  useAxios,
  useDeleteItemModal,
  useLoginContext,
  useModalContext,
} from "common";
import Tooltip from "rc-tooltip";
import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { HiOutlineTrash, HiRefresh } from "react-icons/hi";
import BrandListForm from "./BrandListForm";
import DeactivateBrandList from "./DeactivateBrandList";
import { BrandName, BrandRow } from "./styles";

const BrandListLine = ({ brand, formProps, setBrandList, isNewBrands, data }) => {
  const { setModalContent, closeModal } = useModalContext();
  const { isBrandListAdmin } = useLoginContext();

  const confirmDelete = useDeleteItemModal();

  const brandName =
    isNewBrands || brand.isInactive
      ? `${brand.name} (${brand.category?.name})`
      : brand.name;

  const { callAxios, loading } = useAxios();

  return (
    <BrandRow extend>
      <RowFlex style={{ overflow: "hidden", width: "100%" }}>
        {brand.image && (
          <img
            src={fetchImage(brand.image)}
            alt={brand.name}
            width="24px"
            height="12px"
          />
        )}
        <BrandName>
          {brand.brand ? (
            <Link
              style={{ textDecoration: "underline" }}
              to={generateLinkWithParams(routing.brands.view, {
                [linkPlaceholders.brandId]: brand.brand,
              })}
              target="_blank"
            >
              {brandName}
            </Link>
          ) : (
            brandName
          )}
        </BrandName>
      </RowFlex>
      {isBrandListAdmin && (
        <RowFlex>
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={() => {
              setModalContent(<BrandListForm {...formProps} brand={brand} data={data}/>);
            }}
          />
          {loading ? (
            <Spinner inline />
          ) : !brand.isInactive ? (
            <Tooltip overlay="Deactivate">
              <AiOutlineWarning
                stroke={theme.colors.primary}
                fill={theme.colors.primary}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setModalContent(
                    <DeactivateBrandList brand={brand} {...formProps} />
                  );
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip overlay="Reactivate">
              <HiRefresh
                fill={theme.colors.success}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  callAxios({
                    method: "PUT",
                    url: `/brandList/${brand.id}`,
                    data: { isInactive: false },
                  }).then(() => {
                    formProps.refetch();
                  });
                }}
              />
            </Tooltip>
          )}
          <HiOutlineTrash
            style={{
              cursor: "pointer",
              stroke: theme.colors.danger,
            }}
            onClick={() =>
              confirmDelete({
                item: brand,
                deleteMessage: (i) => `Delete ${i.name}`,
                onComplete: () => {
                  closeModal();
                  setBrandList((p) =>
                    isNewBrands
                      ? p.map((b) =>
                          b.id === brand.id
                            ? { ...b, isNewBrand: false, showAsNewBrand: false }
                            : b
                        )
                      : p.filter((b) => b.id !== brand.id)
                  );
                },
                deleteUrl: (id) => `/brandList/${id}`,
                ...(isNewBrands
                  ? {
                      method: "PUT",
                      data: { isNewBrand: false },
                    }
                  : {}),
              })
            }
          />
        </RowFlex>
      )}
    </BrandRow>
  );
};

export default BrandListLine;
