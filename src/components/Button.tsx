import styled from 'styled-components';

const Button = styled.button<{ inverted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 12px 16px;

  background-color: ${(props) =>
    props.inverted ? props.theme.accent : props.theme.primary};
  border: none;
  border-radius: 5px;
  color: ${(props) => (!props.inverted ? '#ffffff' : props.theme.primary)};
  font-size: 1.6rem;
  font-weight: 500;

  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;

  &:hover {
    outline: 2px solid
      ${(props) => (props.inverted ? '#ffffff' : props.theme.accent)};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${(props) =>
      props.inverted ? '#ffffff' : props.theme.primary};
  }

  &:focus {
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
