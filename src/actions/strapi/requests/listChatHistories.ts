import { strapiClient } from "./apollo/apollo-client"; // assuming the client is initialized here
import { ChatHistoryFiltersInput, LIST_CHAT_HISTORIES, ListChatHistoriesResponse, ListChatHistoryData } from "./gql/LIST_CHAT_HISTORIES"; // adjust the import path accordingly

// Function to execute the chatHistories query
export async function listChatHistories(userIdentity: string): Promise<ListChatHistoryData[] | undefined> {
  try {
    console.log('IDENTITY', userIdentity)
    // we're not passing variables here since the query doesn't require any
    const { data } = await strapiClient.query<ListChatHistoriesResponse, ChatHistoryFiltersInput>({
      query: LIST_CHAT_HISTORIES,
      variables: {
        sort: ["createdAt:desc"],
        filters: {
          and: [
            {
              user_identity: {
                id: {
                  eq: userIdentity
                }
              }
            },
            {
              deleted: {
                eq: false
              }
            }
          ]
        }
      },
      fetchPolicy: 'network-only'
    });

    console.log('Chat histories fetched:', data.chatHistories.data.length);

    return data?.chatHistories.data;
  } catch (error) {
    console.error('An error occurred while fetching chat histories:', error);
  }
}
