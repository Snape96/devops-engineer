'use client';
import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';

interface StreamingMessageProps {
  message: string;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ message }) => {
  return (
    <StreamingMessageContainer>
      <Loader size='sm' />
      <StreamingMessageText>{message}</StreamingMessageText>
    </StreamingMessageContainer>
  );
};

export default StreamingMessage;

export const StreamingMessageContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  max-width: 70%;

  margin: 10px 0;
  padding: 12px 24px;

  background-color: #fff;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.primary};
  font-size: 1.6rem;

  > *:first-child {
    position: absolute;

    top: 4px;
    left: 4px;
  }
`;

export const StreamingMessageText = styled.p`
  margin: 0;
`;
