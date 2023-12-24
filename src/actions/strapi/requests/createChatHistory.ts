import { CREATE_CHAT_HISTORY, CreateChatHistoryResponse, CreateChatHistoryVariables } from "./gql/CREATE_CHAT_HISTORY";
import { strapiClient } from "./apollo/apollo-client";
import { ChatHistory } from "../types/chatHistory";

// Function to execute the createChatHistory mutation
export async function createChatHistory( name: string, model: string, user_identity: string): Promise<ChatHistory | undefined> {
    try {
        const { data } = await strapiClient.mutate<CreateChatHistoryResponse, CreateChatHistoryVariables>( {
            mutation: CREATE_CHAT_HISTORY,
            variables: {
                data: {
                    name,
                    model,
                    user_identity
                },
            },
        } );
      
        console.log( 'Chat history created:', data?.createChatHistory.data );
        
        return data?.createChatHistory.data;
    } catch ( error ) {
        console.error( 'An error occurred while creating chat history:', error );
    }
}