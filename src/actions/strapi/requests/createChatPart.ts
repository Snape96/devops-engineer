import { strapiClient } from "./apollo/apollo-client";
import { CREATE_CHAT_PART, ChatPartInput, ChatPartResponse } from "./gql/CREATE_CHAT_PART";

export async function createChatPart(index: number, role: 'system' | 'user' | 'assistant' | 'function', chat_messages: string[], userId: string): Promise<ChatPartResponse | undefined> {
  try {
    const { data } = await strapiClient.mutate<ChatPartResponse, ChatPartInput>({
      mutation: CREATE_CHAT_PART,
      variables: {
        data: {
          index,
          role,
          chat_messages,
          user_identity: userId
        },
      },
    });

    console.log('Chat part created:', data);

    return data as ChatPartResponse;
  } catch (error) {
    console.error('An error occurred while creating chat part:', error);
  }
}
