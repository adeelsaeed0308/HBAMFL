import React, { Fragment, useContext, useState } from 'react';
import { Close, Container, ModalContainer } from './styles';

const ModalContext = React.createContext({
  closeModal: () => {},
  setModalContent: () => <div>ModalContent</div>,
});

const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState();
  const closeModal = () => setModalContent();
  return (
    <ModalContext.Provider value={{ setModalContent, closeModal }}>
      {modalContent && (
        <Fragment>
          <Container onClick={closeModal} />
          <ModalContainer>
            <Close onClick={closeModal} />
            {modalContent}
          </ModalContainer>
        </Fragment>
      )}
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => useContext(ModalContext);

export { ModalProvider, useModalContext };
