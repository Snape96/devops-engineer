import { ListChatHistoryData } from '@/actions/strapi/requests/gql/LIST_CHAT_HISTORIES';
import { listChatHistories } from '@/actions/strapi/requests/listChatHistories';
import React, { useState } from 'react';
import { useIdentity } from '../../auth/IdentityContext';

interface ChatHistoriesContextValue {
  chatHistories: ListChatHistoryData[];
    refreshChatHistories: () => Promise<void>;
    loading: boolean;
}

// Creating context with default values.
// We're not providing a default for refreshChatHistories since it'll be provided by the actual Provider.
const ChatHistoriesContext = React.createContext<ChatHistoriesContextValue | undefined>(undefined);

export default ChatHistoriesContext;

export const ChatHistoriesWrapper = ( { children }: { children: React.ReactNode; } ) => {
    const [chatHistories, setChatHistories] = useState<ListChatHistoryData[]>( [] );
    const [loading, setLoading] = useState<boolean>( false );
    const identity = useIdentity();

    const refreshChatHistories = async () => {
        setLoading( true );
        const res = await listChatHistories(identity?.userProfile?.id ?? '');
        
        if ( res )
            setChatHistories( res );

        setLoading( false );
    };
     
    return (
        <ChatHistoriesContext.Provider
            value={{
                chatHistories,
                refreshChatHistories,
                loading
            }}
        >
            {children}
        </ChatHistoriesContext.Provider>
    );
};
     