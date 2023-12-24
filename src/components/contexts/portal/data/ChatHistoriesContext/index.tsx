import { ListChatHistoryData } from '@/actions/strapi/requests/gql/LIST_CHAT_HISTORIES';
import { listChatHistories } from '@/actions/strapi/requests/listChatHistories';
import { useIdentity } from '@/components/contexts/auth/IdentityContext';
import React, { useContext, useEffect, useState } from 'react';

interface ChatHistoriesContextValue {
    chatHistories: ListChatHistoryData[];
    refreshChatHistories: () => Promise<void>;
    loading: boolean;
}

// Creating context with default values.
// We're not providing a default for refreshChatHistories since it'll be provided by the actual Provider.
const ChatHistoriesContext = React.createContext<ChatHistoriesContextValue>({} as ChatHistoriesContextValue);

export default ChatHistoriesContext;

export const ChatHistoriesWrapper = ( { children }: { children: React.ReactNode; } ) => {
    const [chatHistories, setChatHistories] = useState<ListChatHistoryData[]>( [] );
    const [loading, setLoading] = useState<boolean>( false );
    const identity = useIdentity();

    useEffect( () => {
        const refreshChatHistories = async () => {
            setLoading( true );
            const res = await listChatHistories(identity?.userProfile?.id ?? '');
            
            if ( res )
                setChatHistories( res );
    
            setLoading( false );
        };
        refreshChatHistories();
    }, [identity?.userProfile?.id] )
    
    const refreshChatHistories = async () => {
        if ( !loading ) {
            setLoading( true );
            const res = await listChatHistories(identity?.userProfile?.id as string);
        
            if ( res )
                setChatHistories( res );

            setLoading( false );
        }
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
     
export const useChatHistoriesContext = () => {
    return useContext(ChatHistoriesContext);
   };