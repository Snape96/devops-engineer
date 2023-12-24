import { strapiClient } from "./apollo/apollo-client";
import { ChatHistory } from "../types/chatHistory";
import { ChatHistoryInput, UPDATE_CHAT_HISTORY_ADD_PART, UpdateChatHistoryResponse } from "./gql/UPDATE_CHAT_HISTORY_ADD_PART";

// Function to execute the createChatHistory mutation
export async function updateChatHistoryAddPart( historyId: string, olderParts: string[], partToAdd: string ): Promise<ChatHistory | undefined> {
    try {
        const { data } = await strapiClient.mutate<UpdateChatHistoryResponse, ChatHistoryInput>( {
            mutation: UPDATE_CHAT_HISTORY_ADD_PART,

            variables: {
                id: historyId,
                data: {
                    chat_parts: [ ...olderParts, partToAdd ]
                },
            },
        } );
      
        console.log( 'Chat history created:', data?.updateChatHistory.data );
        
        return data?.updateChatHistory.data;
    } catch ( error ) {
        console.error( 'An error occurred while creating chat history:', error );
    }
}