'use client';

import { useRouter } from 'next/router';
import PortalLayout from '../PortalLayout';
import ChatContainer from '@/components/ChatContainer';
import { useEffect } from 'react';
import { getChatHistory } from '@/actions/strapi/requests/getChatHistory';
import { useChatContext } from '@/components/contexts/portal/data/ChatContext';
import styled from 'styled-components';
import { useIdentity } from '@/components/contexts/auth/IdentityContext';

export const ChatDetail = () => {
  // Retrieving necessary states and functions from the chat context
  const { history, setModel, setLoading, setHistory } = useChatContext();

  const router = useRouter(); // using the useRouter hook to get the router object
  const identity = useIdentity();

  useEffect(() => {
    // This function fetches chat history if the path is /chat/{id}
    const fetchChatHistory = async () => {
      // Check if the current route is /chat/{id}
      if (
        router.isReady &&
        router.query.id !== history?.id &&
        setLoading &&
        setModel &&
        setHistory
      ) {
        try {
          setLoading(true); // Set loading to true when the request starts

          // Fetch the chat history using the ID from the URL
          const chatHistory = await getChatHistory(router.query.id as string);

          // Check you are on valid page
          if (
            chatHistory.attributes.deleted ||
            chatHistory.attributes.user_identity.data.id !==
              identity?.userProfile?.id
          ) {
            router.push('/chat/error');
          } else {
            // Set the fetched history in your state
            setHistory(chatHistory);
            setModel(chatHistory.attributes.model);
          }
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        } finally {
          setLoading(false); // Set loading to false when the request completes
        }
      }
    };

    // Call fetchChatHistory when the component mounts and when router.query changes
    fetchChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history?.id,
    router.isReady,
    router.pathname,
    router.query,
    setHistory,
    setLoading,
    setModel,
  ]);

  return (
    <PortalLayout>
      <Wrapper>
        <ChatContainer key={router.query.id as string | undefined} />
      </Wrapper>
    </PortalLayout>
  );
};

export default ChatDetail;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 100%;

  > * {
    flex-grow: 1;
    flex-shrink: 0;
  }
`;
