import React from 'react';
import styled from 'styled-components';
import { LeftMenu } from '@/components/LeftMenu';

// Styled components
const LayoutWrapper = styled.main`
  display: flex;
  height: 100vh;
`;

const MainScreen = styled.div`
  flex-grow: 1;
  padding: 32px;

  overflow-y: auto;

  @media (max-width: 1200px) {
    padding-top: 64px;
  }

  @media (max-width: 500px) {
    padding: 64px 16px 16px;
  }
`;

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper>
      <LeftMenu />
      <MainScreen>{children}</MainScreen>
    </LayoutWrapper>
  );
}
