import React, { useState } from 'react';
import styled from 'styled-components';
import { useSession, signIn, signOut } from 'next-auth/react';
import router from 'next/router';
import Button from '@/components/Button';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
`;

const Login = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('google');
    router.push('/chat');
  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit}>
        <Button type='submit'>Log In to CNC Account</Button>
      </LoginForm>
    </Container>
  );
};

export default Login;
