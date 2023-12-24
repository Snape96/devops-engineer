/**
 * Admin.tsx - Main admin component
 * This component serves as the entry point to the admin dashboard and user management sections.
 * It fetches a list of users and shows an admin dashboard with metrics.
 */

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../PortalLayout';
import { useChatContext } from '@/components/contexts/portal/data/ChatContext';
import styled from 'styled-components';
import { UserIdentity } from '@/actions/strapi/requests/gql/LIST_USER_IDENTITES';
import AdminDashboard from '@/components/AdminDashboard';
import UserList from '@/components/UserList';
import { AdminContextWrapper } from '@/components/contexts/admin/AdminContext';
import { AddUserForm } from '@/components/AdminAddUserForm';
import { deleteUserIdentity } from '@/actions/strapi/requests/deleteUserIdentity';

// Main function for the Admin component
export default function Admin() {
  // Using ChatContext for manipulating chat history
  const { setHistory } = useChatContext();

  // Next.js router for navigation-related logic
  const router = useRouter();

  // React useEffect hook runs side-effects in functional components
  useEffect(() => {
    // router.isReady ensures that the router is fully initialized
    if (router.isReady) {
      // Clearing chat history for a fresh start
      setHistory(undefined);
    }
  }, [router.isReady, setHistory]);

  // Function to toggle user access, to be implemented
  const toggleAccess = async (userId: string) => {
    // API call logic should go here
  };

  // Function to toggle admin status, to be implemented
  const toggleAdmin = async (userId: string) => {
    // API call logic should go here
  };

  return (
    <AdminContextWrapper>
      <PortalLayout>
        <AdminContainer>
          <h1>Admin Dashboard</h1>
          <Hr />
          <h2>Statistics</h2>
          {/* AdminDashboard component shows important statistics */}
          <AdminDashboard />
          <Hr />
          {/* AddUserForm component allows adding a new user */}
          <h2>Users</h2>
          <AddUserForm />
          {/* UserList component lists all the users with control buttons */}
          <UserList />
        </AdminContainer>
      </PortalLayout>
    </AdminContextWrapper>
  );
}

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;

  padding: 0 64px;

  h1 {
    margin: 0;

    color: ${(props) => props.theme.primary};
    font-size: 3.2rem;
    font-weight: 500;
  }

  h2 {
    margin: 0 0 16px;

    color: ${(props) => props.theme.primary};
    font-size: 2.4rem;
    font-weight: 500;
    white-space: nowrap;
  }

  h3 {
    margin: 0 0 1em;

    color: ${(props) => props.theme.primary};
    font-size: 2rem;
    font-weight: 500;

    &:not(:first-child) {
      margin-top: 2em;
    }
  }

  @media (max-width: 1200px) {
    padding: 0;
  }
`;

const Hr = styled.hr`
  width: 100%;
  height: 1px;

  background-color: ${(props) => props.theme.accent};
  border: none;
`;
