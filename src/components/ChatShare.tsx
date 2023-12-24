import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { useChatContext } from './contexts/portal/data/ChatContext';
import { shareChatHistory } from '@/actions/strapi/requests/shareChatHistory';
import Button from './Button';
import Loader from './Loader';

type ShareStatus = 'idle' | 'loading' | 'success' | 'fail';

/**
 * ShareChat Component allows the user to share chat history with another user by entering their email.
 * It takes care of the UI and triggers the backend logic to actually share the chat.
 */
const ShareChat: React.FC<{ sharedBy?: string; onChatShared: () => void }> = ({
  sharedBy,
  onChatShared,
}) => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<ShareStatus>('idle');
  const { history } = useChatContext();

  /**
   * Function to handle sharing the chat history.
   * @param email - Email address to share the chat history with
   */
  const handleShare = async (email: string) => {
    try {
      if (history && history.id) {
        setStatus('loading');
        await shareChatHistory(history.id, email);
        setStatus('success');
        setTimeout(() => {
          onChatShared && onChatShared();
          setEmail('');
          setStatus('idle');
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setStatus('fail');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };

  const onShare = async (e: FormEvent) => {
    e.preventDefault();
    await handleShare(email);
  };

  return (
    <SharedContainer>
      <ShareContainer>
        <Form onSubmit={onShare}>
          <h2>Share this chat</h2>
          <ShareInput
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <ShareButton type='submit' status={status}>
            {status === 'success' ? (
              'Shared'
            ) : status === 'loading' ? (
              <Loader size='sm' />
            ) : status === 'fail' ? (
              'Share failed'
            ) : (
              'Share'
            )}
          </ShareButton>
        </Form>
      </ShareContainer>
      {sharedBy && (
        <SharedBy>
          Shared by: <span>{sharedBy}</span>
        </SharedBy>
      )}
    </SharedContainer>
  );
};

export default ShareChat;

const SharedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  padding: 24px 16px;
`;

const SharedBy = styled.div`
  color: ${(props) => props.theme.primary};

  span {
    font-weight: 600;
  }
`;

const ShareContainer = styled.div`
  flex-grow: 1;

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 12px;

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

  p {
    position: absolute;

    bottom: -8px;
    left: 0;
    right: 0;

    margin: 0;
    padding: 0 16px;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 8px;

  flex-wrap: wrap;

  input {
    flex-grow: 1;
  }
`;

const ShareButton = styled(Button)<{ status: ShareStatus }>`
  width: 120px;

  padding: 12px 16px;

  background-color: ${(props) => {
    switch (props.status) {
      case 'idle':
        return props.theme.primary;
      case 'loading':
        return 'rgba(0, 0, 0, .25)';
      case 'fail':
        return 'red';
      case 'success':
        return props.theme.accent;
    }
  }};
  border: none;
  color: ${(props) => {
    switch (props.status) {
      case 'idle':
      case 'fail':
        return '#fff';
      case 'loading':
        return props.theme.primary;
      case 'success':
        return props.theme.primary;
    }
  }};
  font-size: 1.6rem;

  cursor: ${(props) =>
    props.status === 'loading' ? 'not-allowed' : 'pointer'};

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ShareInput = styled.input`
  padding: 12px 16px;

  border: 2px solid #ffffff;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;

  resize: none;

  &:focus {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`;
