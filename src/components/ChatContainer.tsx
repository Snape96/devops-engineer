'use client';

import React, { KeyboardEventHandler } from 'react';
import { useChatContext } from './contexts/portal/data/ChatContext';
import Message from './ChatMessage';
import StreamingMessage from './ChatStreamingMessage';
import { saveNewHistoryToDatabase } from '@/actions/strapi/chat';
import { sendNewMessage } from '@/actions/chat/sendMessage/sendNewMessage';
import { createChatPartPlaceholder } from '@/helpers/createChatPartPlaceholder';
import { nameChatHistory } from '@/actions/chat/nameChatHistory';
import { StreamingTextResponse } from 'ai';
import { useChatHistoriesContext } from './contexts/portal/data/ChatHistoriesContext';
import { useIdentity } from './contexts/auth/IdentityContext';
import styled from 'styled-components';
import Button from './Button';
import ShareChat from './ChatShare';
import { CncLogo } from './Icons/CncLogo';
import ChatModelSelect from './ChatModelSelect';
import { useEffect, useState } from 'react';
import { listPremadePrompts } from '@/actions/strapi/requests/listPremadePrompts';
import { ListPremadePromptsData } from '@/actions/strapi/requests/gql/LIST_PREMADE_PROMPTS';
import { MessageShared } from './Icons/MessageShared';
import { IconButton } from './IconButton';
import { Settings } from './Icons/Settings';

/**
 * The ChatContainer component handles the chat interface, including input, display of messages, and interaction with chat context
 */
const ChatContainer = ({
  onlyInput,
  onChatCreate,
}: {
  onlyInput?: boolean;
  onChatCreate?: (id: string) => void;
}) => {
  // Retrieving necessary states and functions from the chat context
  const {
    history,
    userInput,
    setUserInput,
    loading,
    streamingResponse,
    model,
    setModel,
    tempChatMessage,
    setLoading,
    setHistory,
    setStreamingResponse,
    setTempChatMessage,
  } = useChatContext();

  const { refreshChatHistories } = useChatHistoriesContext();
  const identity = useIdentity();

  // Handler for changes in the chat text area, updates the user input state
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!loading) {
      setUserInput(event.target.value);
    }
  };

  // Handler for sending messages, interacts with the chat context and backend
  const handleSendMessage = async (customInput?: string) => {
    let lastHistorySnippet = history;
    let wasCreated = false;

    // Create new history if there's none
    if (!history) {
      lastHistorySnippet = await saveNewHistoryToDatabase(
        model,
        identity?.userProfile?.id ?? ''
      );
      setHistory(lastHistorySnippet);
      wasCreated = true;
    }

    // Proceed only if history is available
    if (lastHistorySnippet) {
      let renameTask: Promise<StreamingTextResponse> | null = null;
      const firstMessage = customInput || userInput;

      if (lastHistorySnippet.attributes.name === '') {
        renameTask = nameChatHistory(
          firstMessage,
          lastHistorySnippet.id as string,
          refreshChatHistories
        );
      }

      const res = await sendNewMessage(
        lastHistorySnippet,
        customInput || userInput,
        model,
        identity?.userProfile?.id as string,
        setLoading,
        setHistory,
        setUserInput,
        setStreamingResponse,
        setTempChatMessage
      );

      if (wasCreated && onChatCreate && lastHistorySnippet.id)
        onChatCreate(lastHistorySnippet.id);

      if (renameTask) {
        console.log((await renameTask).json());
      }

      console.log(res.json());
    } else {
      throw new Error('Failed to create history. Server might be offline');
    }
  };

  console.log(history, tempChatMessage, streamingResponse);

  const [premadePrompts, setPremadePrompts] =
    useState<ListPremadePromptsData[]>();
  useEffect(() => {
    (async () => {
      const res = await listPremadePrompts();
      setPremadePrompts(res);
    })();
  }, []);

  const sendPremadePrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [showMobileShare, setShowMobileShare] = useState<boolean>(false);

  // Rendering the chat container with messages, input area, and send button
  return (
    <ChatContainerStyle>
      <ContentWrapper>
        {history || tempChatMessage || streamingResponse ? (
          <Content>
            {/* Content must be in reverse order for CSS-only autoscroll to bottom */}
            {/* Render streaming response, if any */}
            {streamingResponse && (
              <StreamingMessage message={streamingResponse} />
            )}
            {/* Render temporary message, if any */}
            {tempChatMessage && (
              <Message
                key={-1}
                message={{
                  isUser: true,
                  content: createChatPartPlaceholder(tempChatMessage),
                }}
              />
            )}
            {/* Render chat history */}
            {history &&
              history.attributes.chat_parts?.data
                .toReversed()
                .map((message, index) => (
                  <Message
                    key={index}
                    message={{
                      isUser: message.attributes.role === 'user',
                      content: message,
                    }}
                  />
                ))}
          </Content>
        ) : (
          <Info>
            <Logo>
              <CncLogo />
              <ChatGpt>Chat GPT</ChatGpt>
            </Logo>
            <PremadePrompts>
              {premadePrompts?.map((prompt, key) => (
                <PremadePrompt
                  key={key}
                  onClick={() => {
                    sendPremadePrompt(prompt.attributes.prompt);
                  }}
                >
                  <h3>{prompt.attributes.name}</h3>
                  <p>{prompt.attributes.description}</p>
                </PremadePrompt>
              ))}
            </PremadePrompts>
          </Info>
        )}
      </ContentWrapper>
      <SendContainer>
        <SendWrapper style={{ position: 'relative' }}>
          {/* Text input area */}
          <ChatTextAreaStyle
            value={userInput}
            onChange={handleChange}
            $loading={loading}
            rows={userInput.split('\n').length}
            placeholder='Your message'
            onKeyDown={handleKeyDown}
          />
          {/* Send button */}
          <Button
            disabled={loading}
            onClick={() => {
              handleSendMessage();
            }}
          >
            {loading ? 'Loading...' : 'Send'}
          </Button>
        </SendWrapper>
        {history?.id ? (
          <ShowShareButton
            onClick={() => {
              setShowMobileShare(true);
            }}
          >
            <MessageShared />
          </ShowShareButton>
        ) : (
          <ModelButton
            onClick={() => {
              setShowMobileShare(true);
            }}
          >
            <span>{model}</span>
            <Settings />
          </ModelButton>
        )}
      </SendContainer>
      <ShareWrapper $showMobileShare={showMobileShare}>
        <ShareOverlay
          onClick={() => {
            setShowMobileShare(false);
          }}
        />
        <ShareContent>
          {history?.id ? (
            <ShareChat
              onChatShared={() => {
                setShowMobileShare(false);
              }}
              sharedBy={history?.attributes.shared_by}
            />
          ) : (
            <ChatModelSelect
              onModelChange={() => {
                setShowMobileShare(false);
              }}
            />
          )}
        </ShareContent>
      </ShareWrapper>
    </ChatContainerStyle>
  );
};

export default ChatContainer;

const ChatContainerStyle = styled.div`
  flex-grow: 1;
  flex-shrink: 0;

  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;

  margin: 0 -16px;
  padding: 0 16px;

  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;

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

const Info = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 32px;

  padding: 64px;

  @media (max-width: 500px) {
    padding: 32px;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;

  svg {
    width: 291px;
    height: 117px;
  }
`;

const PremadePrompts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;

    margin-bottom: -32px;
  }
`;

const PremadePrompt = styled.button`
  padding: 12px 16px;

  background-color: transparent;
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  text-align: left;

  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  h3 {
    margin: 0;

    color: ${(props) => props.theme.primary};
    font-size: 2.4rem;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 500px) {
      font-size: 2rem;
    }
  }

  p {
    margin: 4px 0 0;
    font-size: 1.6rem;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 500px) {
      font-size: 1.4rem;
    }
  }

  &:hover {
    transform: scale(1.025);
  }

  @media (max-width: 500px) {
    margin: 0 -32px;
  }
`;

const ChatGpt = styled.span`
  color: ${(props) => props.theme.primary};
  font-size: 3.2rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const ChatTextAreaStyle = styled.textarea<{
  $loading: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}>`
  width: 100%;

  padding: 14px 88px 14px 16px;

  border: 2px solid #ffffff;
  border-radius: 9px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;

  resize: none;
  opacity: ${(props) => (props.$loading ? 0.5 : 1)};
  cursor: ${(props) => (props.$loading ? 'not-allowed' : 'auto')};

  &:focus {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`;

const SendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 32px;
`;

const SendWrapper = styled.div`
  flex-grow: 1;
  position: relative;

  button {
    position: absolute;

    bottom: 7px;
    right: 4px;
  }
`;

const ShowShareButton = styled(IconButton)`
  display: initial;
`;

const ModelButton = styled(Button)`
  margin-top: -3px;
  padding: 12px 16px;

  background-color: rgba(0, 0, 0, 0.05);
  color: ${(props) => props.theme.primary};

  svg {
    width: 24px;
    height: 24px;

    margin: -2px 0;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 500px) {
    span {
      display: none;
    }
  }
`;

const ShareOverlay = styled.div``;

const ShareContent = styled.div`
  background-color: #fff;
  border-radius: 5px;

  @media (max-width: 500px) {
    border-radius: 5px 5px 0 0;
  }
`;

const ShareWrapper = styled.div<{ $showMobileShare: boolean }>`
  position: fixed;
  z-index: 99999;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  pointer-events: ${(props) => (props.$showMobileShare ? 'initial' : 'none')};

  ${ShareOverlay} {
    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: ${(props) =>
      props.$showMobileShare ? 'rgba(0, 0, 0, 0.25)' : 'transparent'};
    backdrop-filter: ${(props) =>
      props.$showMobileShare ? 'blur(2px)' : 'blur(0)'};

    pointer-events: ${(props) => (props.$showMobileShare ? 'initial' : 'none')};
    transition: all 0.2s ease-out;
  }

  ${ShareContent} {
    box-shadow: ${(props) =>
      props.$showMobileShare
        ? '0 0 16px -2px rgba(0, 0, 0, 0.15)'
        : '0 0 0 0 transparent'};

    transform: translateY(
      ${(props) => (props.$showMobileShare ? '0' : '100%')}
    );
    opacity: ${(props) => (props.$showMobileShare ? '1' : '0')};
    transition: all 0.2s ease-out;
  }

  @media (max-width: 500px) {
    align-items: stretch;
    justify-content: flex-end;
  }
`;
