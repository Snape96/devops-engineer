import styled from 'styled-components';

export const IconButton = styled.button`
  position: relative;

  margin: 0;
  padding: 8px;

  background-color: transparent;
  border: none;

  width: 40px;
  height: 40px;

  color: ${(props) => props.theme.accent};

  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  &:before {
    content: '';
    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(0, 0, 0, 0);
    border-radius: 999px;

    transition: background-color 0.2s ease-out;
  }

  &:hover:before {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active:before {
    background-color: rgba(0, 0, 0, 0.1);
    transition: background-color 0 ease-out;
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;
