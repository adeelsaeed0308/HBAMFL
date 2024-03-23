import styled, { css, keyframes } from 'styled-components';

const lds1 = keyframes`
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
`;
const lds2 = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
`;
const lds3 = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
  & div {
    position: absolute;
    top: 13px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${({ color, theme }) => color || theme.colors.primary};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  & div:nth-child(1) {
    left: -12px;
    animation: ${lds1} 0.6s infinite;
  }
  & div:nth-child(2) {
    left: -12px;
    animation: ${lds2} 0.6s infinite;
  }
  & div:nth-child(3) {
    left: 12px;
    animation: ${lds2} 0.6s infinite;
  }
  & div:nth-child(4) {
    left: 36px;
    animation: ${lds3} 0.6s infinite;
  }
  ${({ inline }) =>
    inline &&
    css`
      width: 40px;
      height: 20px;
      overflow: hidden;
      & div {
        top: 8px;
        width: 8px;
        height: 8px;
      }
    `}
`;

export { SpinnerContainer };
