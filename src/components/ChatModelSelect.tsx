import { useEffect, useState } from 'react';
import { useChatContext } from './contexts/portal/data/ChatContext/index';
import styled from 'styled-components';
import Button from './Button';

const options = ['gpt-3.5-turbo', 'gpt-4'];

const ChatModelSelect: React.FC<{ onModelChange: () => void }> = ({
  onModelChange,
}) => {
  const { setModel } = useChatContext();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setModel(options[activeIndex]);
  }, [activeIndex, setModel]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setModel(options[index]);
    onModelChange && onModelChange();
  };

  return (
    <SwitchContainer>
      <h2>Select model</h2>
      {options.map((option, index) => (
        <SwitchOption
          key={option}
          $active={activeIndex === index ? true : false}
          onClick={() => handleClick(index)}
        >
          {option}
        </SwitchOption>
      ))}
    </SwitchContainer>
  );
};

export default ChatModelSelect;

const SwitchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;

  padding: 24px 16px;

  h2 {
    width: 100%;

    margin: 0 0 8px;

    color: ${(props) => props.theme.primary};
    font-size: 1.8rem;
    font-weight: 600;

    &:after {
      content: ': ';
    }
  }
`;

const SwitchOption = styled(Button)<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? props.theme.accent : 'transparent'};
  box-shadow: inset 0 0 0 2px ${(props) => props.theme.accent};
  color: ${(props) => props.theme.primary};
  font-size: 1.4rem;

  &:hover {
    outline-color: ${(props) => props.theme.primary};
  }

  &:active {
    background-color: ${(props) => props.theme.accent}99;
  }
`;
