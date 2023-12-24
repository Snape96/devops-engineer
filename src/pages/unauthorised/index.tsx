'use client';

import ChatModelSelect from '@/components/ChatModelSelect';
import PortalLayout from '../PortalLayout';
import ChatContainer from '@/components/ChatContainer';
import { useChatContext } from '@/components/contexts/portal/data/ChatContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Unauthorised() {
  return (
    <h1>
      You cannot access this page. Contact system administrator to gain access.
    </h1>
  );
}
