import { strapiClient } from './apollo/apollo-client'; // assuming the client is initialized here
import {
  LIST_PREMADE_PROMPTS,
  ListPremadePromptsData,
  ListPremadePromptsResponse,
} from './gql/LIST_PREMADE_PROMPTS';

// Function to execute the preamdePrompts query
export async function listPremadePrompts(): Promise<
  ListPremadePromptsData[] | undefined
> {
  try {
    // we're not passing variables here since the query doesn't require any
    const { data } = await strapiClient.query<ListPremadePromptsResponse>({
      query: LIST_PREMADE_PROMPTS,
      variables: {
        sort: ['createdAt:desc'],
      },
      fetchPolicy: 'network-only',
    });

    console.log('Premade prompts fetched:', data.premadePrompts.data.length);

    return data?.premadePrompts.data;
  } catch (error) {
    console.error('An error occurred while fetching premade prompts:', error);
  }
}
