/**
 * Component for adding a new user
 *
 * This component contains a simple form that takes an email,
 * validates it and then triggers the API call to create a new user.
 */

import React, { useState } from 'react';
import { createUserIdentity } from '@/actions/strapi/requests/createUserIdentity'; // adjust the import based on your directory structure
import { useAdminContext } from './contexts/admin/AdminContext';
import Button from './Button';
import styled from 'styled-components';

export const AddUserForm: React.FC = () => {
  // Local state to hold the email value
  const [email, setEmail] = useState<string>('');

  // Local state to handle form submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const adminContext = useAdminContext();

  /**
   * handleAddUser - Function to handle the form submission.
   *
   * This function is called when the form is submitted.
   * It validates the email, sets the `isSubmitting` state,
   * calls `createUserIdentity` and then resets the state.
   */
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    if (
      adminContext.users.some((e) => e.attributes.email === email.toLowerCase())
    ) {
      alert(`User ${email} already exists`);
      return;
    }

    setIsSubmitting(true);

    try {
      const newUser = await createUserIdentity(email.toLowerCase());
      console.log('New user added:', newUser);
    } catch (error) {
      console.error('An error occurred while adding the user:', error);
    } finally {
      await adminContext.fetchUsers(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        true
      );
      setIsSubmitting(false);
      setEmail('');
    }
  };

  return (
    <Form onSubmit={handleAddUser}>
      <Input
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type='submit' inverted disabled={isSubmitting}>
        Add user
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  padding: 12px 24px;

  background-color: ${(props) => props.theme.primary};
  border-radius: 5px;
`;

const Input = styled.input`
  padding: 12px 16px 12px 16px;

  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;

  &:focus {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 500px) {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;

    width: 1px;
  }
`;
