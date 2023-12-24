import { strapiClient } from "./apollo/apollo-client";
import { ChatHistoryInput, DeleteChatHistoryResponse, UPDATE_CHAT_HISTORY_DELETE } from "./gql/UPDATE_CHAT_HISTORY_DELETE";

export async function updateChatHistoryDelete( historyId: string ): Promise<string | undefined> {
    try {
        const { data } = await strapiClient.mutate<DeleteChatHistoryResponse, ChatHistoryInput>( {
            mutation: UPDATE_CHAT_HISTORY_DELETE,

            variables: {
                id: historyId,
                data: {
                    deleted: true
                },
            },
        } );
      
        console.log( 'Chat history deleted:', data?.updateChatHistory.data.id );
        
        return data?.updateChatHistory.data.id;
    } catch ( error ) {
        console.error( 'An error occurred while deleting chat history:', error );
    }
}