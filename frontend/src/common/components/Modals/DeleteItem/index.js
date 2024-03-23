import { useModalContext } from "common/context";
import { ItemSplitter } from "common/styles";
import React from "react";
import { useAxios } from "../../../axios";
import { Button } from "../../Buttons";
import { DeleteModal } from "./styles";

const DeleteItemModal = ({
  item,
  deleteMessage = () => "Delete Item",
  onComplete = () => {},
  closeModal = () => {},
  deleteUrl = () => {},
  method = "DELETE",
  data,
}) => {
  const { callAxios: deleteItemAxios, loading } = useAxios({
    alertSuccess: "Deleted Successfully",
    onComplete,
  });

  return (
    <DeleteModal>
      <h3>{deleteMessage(item)}</h3>
      <p>Are you sure?</p>
      <ItemSplitter>
        <Button secondary onClick={closeModal}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            deleteItemAxios({
              method,
              url: deleteUrl(item.id),
              data,
            });
          }}
        >
          Delete
        </Button>
      </ItemSplitter>
    </DeleteModal>
  );
};

const useDeleteItemModal = () => {
  const { setModalContent, closeModal } = useModalContext();
  const openModal = ({
    deleteMessage,
    item,
    onComplete,
    deleteUrl,
    method,
    data,
  }) => {
    setModalContent(
      <DeleteItemModal
        item={item}
        deleteMessage={deleteMessage}
        deleteUrl={deleteUrl}
        onComplete={onComplete}
        closeModal={closeModal}
        method={method}
        data={data}
      />
    );
  };

  return openModal;
};

export { DeleteItemModal, useDeleteItemModal };
