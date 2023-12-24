import styled from 'styled-components';

const sizes = {
  xs: 12,
  sm: 16,
  md: 48,
  lg: 128,
};

const Loader = ({ size }: { size: keyof typeof sizes }) => {
  return <LoaderEl size={sizes[size]} />;
};

export default Loader;

const LoaderEl = styled.div<{ size: number }>`
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes prixClipFix {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    75%,
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
  }

  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  transform: scale(${(props) => props.size / 48});

  &:before,
  &:after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: ${(props) => (props.size / 48) * 5}px solid #0d4f92;
    animation: prixClipFix 2s linear infinite;
  }

  &:after {
    inset: ${(props) => (props.size / 48) * 8}px;
    transform: rotate3d(90, 90, 0, 180deg);
    border-color: #b4d333;
  }
`;
