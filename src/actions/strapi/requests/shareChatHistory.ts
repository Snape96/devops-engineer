import { strapiClient } from "./apollo/apollo-client";
import { SHARE_CHAT_HISTORY, ShareChatHistoryInput, ShareChatHistoryResponse } from "./gql/SHARE_CHAT_HISTORY";

// Function to execute the createChatHistory mutation
export async function shareChatHistory( historyId: string, recipientEmail: string ): Promise<ShareChatHistoryResponse | undefined> {
    try {
        const { data } = await strapiClient.mutate<ShareChatHistoryResponse, ShareChatHistoryInput>( {
            mutation: SHARE_CHAT_HISTORY,

            variables: {
                originalChatHistoryId: historyId,
                newUserEmail: recipientEmail
            },
        } );
      
        console.log( 'Chat history shared with ', recipientEmail );
        
        return data ?? undefined;
    } catch ( error ) {
        console.error( 'An error occurred while sharing chat history:', error );
    }
}