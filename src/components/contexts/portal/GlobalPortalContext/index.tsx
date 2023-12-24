import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { ChatContextWrapper } from '../data/ChatContext';
import { ChatHistoriesWrapper } from '../data/ChatHistoriesContext';
import { IdentityContextProps, useIdentity } from '../../auth/IdentityContext';
import LoadingPage from '@/components/LoadingPage';
import styled from 'styled-components';
import Button from '@/components/Button';

/**
 * UserState type representing all possible states for the user.
 */
type UserState =
  | 'Loading'
  | 'Admin'
  | 'NormalUser'
  | 'Unauthorized'
  | 'Error'
  | 'FirstTimeLogin';

/**
 * Calculate user state based on session status and identity attributes.
 *
 * @param sessionStatus - The status from useSession.
 * @param identity - User identity from IdentityContext.
 * @returns UserState - The calculated state of the user.
 */
const getUserState = (
  sessionStatus: string,
  identity: IdentityContextProps | null,
  router: NextRouter
): UserState => {
  // New users navigating to '/auth' for the first time
  if (sessionStatus === 'unauthenticated' && router.pathname === '/auth') {
    return 'FirstTimeLogin';
  }

  if (sessionStatus === 'loading' || identity?.isLoading) {
    return 'Loading';
  }

  if (sessionStatus === 'unauthenticated') {
    return 'Unauthorized';
  }

  if (identity?.userProfile?.attributes.is_admin) {
    return 'Admin';
  }

  if (identity?.userProfile?.attributes.has_access) {
    return 'NormalUser';
  }

  // Introduce error state if necessary attributes aren't available
  if (identity && !identity.userProfile) {
    return 'Error';
  }

  return 'Unauthorized';
};

export const GlobalPortalContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status: sessionStatus } = useSession();
  const identity = useIdentity();
  const router = useRouter();
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  // Maintain a state variable to keep track of the user state.
  const [userState, setUserState] = useState<UserState>('Loading');

  useEffect(() => {
    setTimeout(() => {
      setInitialLoadDone(true);
    }, 3000);
  }, []);

  useEffect(() => {
    // Consolidated useEffect to manage both session and identity
    const newState = getUserState(sessionStatus, identity, router);
    if (
      newState === 'Unauthorized' &&
      router.pathname !== '/auth' &&
      router.pathname !== '/unauthorized'
    ) {
      router.replace('/auth'); // Using replace to avoid flicker and back-button issues
    }
    setUserState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus, identity]);

  useEffect(() => {
    // Use a switch-case for more clarity and to allow easy addition of more states
    console.log(userState);
    switch (userState) {
      case 'Loading':
      case 'Error':
        return;
      case 'Unauthorized':
        if (
          router.pathname !== '/auth' &&
          router.pathname !== '/unauthorized'
        ) {
          router.replace('/auth'); // Using replace to avoid flicker and back-button issues
        }
        return;
      case 'Admin':
        if (
          router.pathname === '/auth' ||
          router.pathname === '/unauthorized'
        ) {
          router.replace('/admin');
        }
        return;
      case 'NormalUser':
        if (
          router.pathname === '/auth' ||
          router.pathname === '/unauthorized' ||
          router.pathname === '/admin'
        ) {
          router.replace('/chat');
        }
        return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, router.pathname]);

  // Handle rendering based on the user state.
  switch (userState) {
    case 'Loading':
      return <LoadingPage />;
    case 'FirstTimeLogin':
      return children;
    case 'Unauthorized':
    case 'Error': // Added error state
      return !initialLoadDone ? (
        <LoadingPage />
      ) : (
        <UnauthorizedWrapper>
          <h1>Unauthorized</h1>
          <Button onClick={() => signOut()}>Log out</Button>
        </UnauthorizedWrapper>
      );
    case 'Admin':
    case 'NormalUser':
      return (
        <ChatHistoriesWrapper>
          <ChatContextWrapper>{children}</ChatContextWrapper>
        </ChatHistoriesWrapper>
      );
  }
};

const UnauthorizedWrapper = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: #f7f7f7;
`;
