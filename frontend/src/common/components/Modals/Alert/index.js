import { useModalContext } from "common/context";
import React from "react";
import { Button } from "../../Buttons";
import { DeleteModal } from "./styles";

const AlertModal = ({ message, onClose }) => {
  const { closeModal } = useModalContext();

  return (
    <DeleteModal>
      <h3>{message}</h3>
      <Button
        onClick={() => {
          closeModal();
          onClose?.();
        }}
      >
        OK
      </Button>
    </DeleteModal>
  );
};

const useAlertModal = (message, onClose) => {
  const { setModalContent } = useModalContext();
  const openModal = (localMessage, localOnClose) => {
    setModalContent(
      <AlertModal
        message={localMessage || message}
        onClose={localOnClose || onClose}
      />
    );
  };

  return openModal;
};

export { AlertModal, useAlertModal };
