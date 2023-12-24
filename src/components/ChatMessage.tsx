import React, { useEffect, useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Importing required context and actions
import { useChatContext } from './contexts/portal/data/ChatContext';
import { ChatPart } from '@/actions/strapi/types/chatPart';
import { regenerateMessage } from '@/actions/chat/sendMessage/regenerateMessage';
import { ChatHistory } from '@/actions/strapi/types/chatHistory';

import { useIdentity } from './contexts/auth/IdentityContext';
import styled from 'styled-components';
import { Refresh } from './Icons/Refresh';
import { IconButton } from './IconButton';
import Arrow from './Icons/Arrow';

/**
 * @interface MessageProps
 * @description Defines the structure for the MessageProps object.
 * - message: Object containing user-related flags and message content.
 */
interface MessageProps {
  message: {
    isUser: boolean;
    content: ChatPart;
  };
}

/**
 * @function Message
 * @description Functional component to render a single message in the chat window.
 * @param {MessageProps} props - Message properties (message content and user flags).
 * @returns {React.FC} Returns a JSX element to render the message.
 */
const Message: React.FC<MessageProps> = ({ message }) => {
  // Destructure the chat messages from the attributes.
  const {
    chat_messages: { data: messages },
  } = message.content.attributes;

  // Import the chat context.
  const { setLoading, setHistory, history } = useChatContext();

  const identity = useIdentity();

  // Define local states for managing messages and streaming response.
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(-1);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [regenerating, setRegenerating] = useState<boolean>(false);

  /**
   * @useEffect
   * @description React Effect Hook to initialize the current message index to the last message in the array.
   */
  useEffect(() => {
    setCurrentMessageIndex(messages.length - 1);
  }, [messages]);

  /**
   * @async
   * @function handleRegenerate
   * @description Callback function to regenerate the current chat message.
   */
  const handleRegenerate = useCallback(async () => {
    setRegenerating(true);
    try {
      const streamRes = await regenerateMessage(
        history as ChatHistory,
        message.content.attributes.index,
        identity?.userProfile?.id as string,
        setLoading,
        setHistory,
        setStreamingResponse
      );
      // Retaining this due to an external library bug
      console.log(streamRes.json());
    } catch (error) {
      // If an error occurs, switch to the next available message
      setCurrentMessageIndex((prevIndex) =>
        Math.min(prevIndex + 1, messages.length - 1)
      );
    }
    setRegenerating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, message, setLoading, setHistory, messages]);

  /**
   * @function handleSwitchMessage
   * @description Function to switch the message being displayed.
   * @param {number} newIndex - The index of the message to switch to.
   */
  const handleSwitchMessage = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < messages.length) {
        setCurrentMessageIndex(newIndex);
      }
    },
    [messages]
  );

  return (
    // Display the message based on whether it is from the user or the system.
    message.isUser ? (
      <UserMessageStyle>
        <Overflow>
          <Markdown remarkPlugins={[remarkGfm]}>
            {messages[currentMessageIndex]?.attributes.message}
          </Markdown>
        </Overflow>
      </UserMessageStyle>
    ) : (
      <ChatGPTMessageStyle>
        {message.content.attributes.role === 'system' && (
          <RegenerateButtonStyle type='button' onClick={handleRegenerate}>
            <Refresh />
          </RegenerateButtonStyle>
        )}
        <Overflow>
          <Markdown remarkPlugins={[remarkGfm]}>
            {streamingResponse ||
              messages[currentMessageIndex]?.attributes.message}
          </Markdown>
        </Overflow>
        {messages.length > 1 && !regenerating && (
          <>
            <SwitchButtonStyle
              type='button'
              onClick={() => handleSwitchMessage(currentMessageIndex - 1)}
              disabled={currentMessageIndex === 0}
            >
              <Arrow direction='up' />
            </SwitchButtonStyle>
            <SwitchButtonStyle
              type='button'
              onClick={() => handleSwitchMessage(currentMessageIndex + 1)}
              disabled={currentMessageIndex === messages.length - 1}
            >
              <Arrow direction='down' />
            </SwitchButtonStyle>
          </>
        )}
      </ChatGPTMessageStyle>
    )
  );
};

export default Message;

const UserMessageStyle = styled.div`
  align-self: flex-end;

  max-width: calc(100% - 136px);

  margin: 10px 0;

  background-color: ${(props) => props.theme.primary};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  color: #ffffff;
  font-size: 1.6rem;

  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 500px) {
    max-width: calc(100% - 56px);
  }
`;

const Overflow = styled.div`
  padding: 12px 24px;

  border-radius: 5px;

  overflow: auto;

  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.accent} #eee;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.accent};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #eee;
    border: 1px solid #eee;
    border-radius: 4px;
  }
`;

const ChatGPTMessageStyle = styled.div`
  position: relative;

  align-self: flex-start;

  max-width: calc(100% - 136px);

  margin: 10px 0;

  background-color: #fff;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.primary};
  font-size: 1.6rem;

  p:first-of-type {
    margin-top: 0;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 500px) {
    max-width: calc(100% - 56px);
  }

  ${Overflow} {
    @media (max-width: 500px) {
      min-height: 120px;
    }
  }
`;

const RegenerateButtonStyle = styled(IconButton)`
  position: absolute;

  top: 0;
  right: 0;

  transform: translateX(calc(100% + 16px));
`;

const SwitchButtonStyle = styled(IconButton)`
  position: absolute;

  top: 0;
  right: 0;

  transform: translateX(calc(100% + 56px));

  & + & {
    transform: translateX(calc(100% + 96px));
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
  }

  @media (max-width: 500px) {
    top: 40px;
    transform: translateX(calc(100% + 16px));

    & + & {
      top: 80px;
      transform: translateX(calc(100% + 16px));
    }
  }
`;
