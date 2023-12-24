import { ChatHistory } from "../types/chatHistory";
import { strapiClient } from "./apollo/apollo-client"; // assuming the client is initialized here
import { GET_CHAT_HISTORY, GetChatHistoryResponse, GetChatHistoryVariables } from "./gql/GET_CHAT_HISTORY";

/**
 * Fetches chat history by id.
 *
 * @param id - The unique identifier for the chat history to fetch.
 * @param ignoreCache - Optional flag to control whether to ignore cache and fetch from the network.
 * @returns - A Promise resolving to the fetched ChatHistory.
 * @throws - Will throw an error if fetching fails.
 */
export async function getChatHistory(
  id: string,
  ignoreCache: boolean = false // Default is false, so it uses cache unless specified
): Promise<ChatHistory> {
  try {
    const fetchPolicyString = ignoreCache ? 'network-only' : 'cache-first'; // Set fetchPolicy based on the flag

    const { data } = await strapiClient.query<GetChatHistoryResponse, GetChatHistoryVariables>({
      query: GET_CHAT_HISTORY,
      variables: {
        id,
      },
      fetchPolicy: fetchPolicyString, // Using the dynamically set fetchPolicy
    });

    console.log('Chat history fetched:', data);

    return data.chatHistory.data;
  } catch (error) {
    console.error('An error occurred while fetching chat histories:', error);
    throw new Error(`Failed to fetch history for id ${id}`);
  }
}
