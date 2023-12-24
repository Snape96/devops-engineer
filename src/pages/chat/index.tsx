'use client';

import ChatModelSelect from '@/components/ChatModelSelect';
import PortalLayout from '../PortalLayout';
import ChatContainer from '@/components/ChatContainer';
import { useChatContext } from '@/components/contexts/portal/data/ChatContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export default function NewChat() {
  // Retrieving necessary states and functions from the chat context
  const { history, setModel, setLoading, setHistory } = useChatContext();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setHistory(undefined);
    }
  }, [router.isReady, setHistory]);

  const onChatCreate = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <PortalLayout>
      <Wrapper>
        <ChatContainer onChatCreate={onChatCreate} />
      </Wrapper>
    </PortalLayout>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 100%;
`;

const Info = styled.div`
  flex-grow: 1;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 32px;

  padding: 64px 64px;
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

const ChatGpt = styled.span`
  color: ${(props) => props.theme.primary};
  font-size: 3.2rem;
  font-weight: 800;
  text-transform: uppercase;
`;
