import { ChatMessage } from "../types/chatMessage";
import { strapiClient } from "./apollo/apollo-client";
import { CREATE_CHAT_MESSAGE, ChatMessageData, ChatMessageResponse, ChatMessageVariables } from "./gql/CREATE_CHAT_MESSAGE";


export async function createChatMessage( message: string, index: number, userId: string, model: string, role: string): Promise<ChatMessageData | undefined> {
    try {
      const { data } = await strapiClient.mutate<ChatMessageResponse, ChatMessageVariables>( {
        mutation: CREATE_CHAT_MESSAGE,
        variables: {
          data: {
            index,
            message,
            state: 'success',
            timestamp: new Date().toISOString(),
            user_identity: userId,
            model: model,
            role: role
          },
        },
      } );
  
      console.log('Chat message created:', data?.createChatMessage);
  
      return data?.createChatMessage;
    } catch (error) {
      console.error('An error occurred while creating chat message:', error);
    }
  }