import { strapiClient } from "./apollo/apollo-client"; // assuming the client is initialized here
import { ChatHistoryPartsListResponse, ChatHistoryPartsListVariables, LIST_CHAT_HISTORY_PARTS } from "./gql/LIST_CHAT_HISTORY_PARTS";

// Function to execute the chatHistories query
export async function listChatHistoryParts( id: string ): Promise<string[]> {
  try {
    const { data } = await strapiClient.query<ChatHistoryPartsListResponse, ChatHistoryPartsListVariables>( {
      query: LIST_CHAT_HISTORY_PARTS,
      variables: {
        id
      },
      fetchPolicy: 'network-only'
    } );

    console.log( 'Chat histories fetched:', data );

    return data?.chatHistory.data.attributes.chat_parts.data.map( e => e.id ) ?? [];
  } catch ( error ) {
    console.error( 'An error occurred while fetching chat histories:', error );
    return [];
  }
}
