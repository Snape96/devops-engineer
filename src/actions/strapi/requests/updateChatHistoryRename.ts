import { strapiClient } from "./apollo/apollo-client";
import { ChatHistory } from "../types/chatHistory";
import { ChatHistoryInput, RenameChatHistoryResponse, UPDATE_CHAT_HISTORY_RENAME } from "./gql/UPDATE_CHAT_HISTORY_RENAME";

export async function updateChatHistoryRename( historyId: string, name: string ): Promise<ChatHistory | undefined> {
    try {
        const { data } = await strapiClient.mutate<RenameChatHistoryResponse, ChatHistoryInput>( {
            mutation: UPDATE_CHAT_HISTORY_RENAME,

            variables: {
                id: historyId,
                data: {
                    name
                },
            },
        } );
      
        console.log( 'Chat history renamed:', data?.updateChatHistory.data );
        
        return data?.updateChatHistory.data;
    } catch ( error ) {
        console.error( 'An error occurred while creating chat history:', error );
    }
}