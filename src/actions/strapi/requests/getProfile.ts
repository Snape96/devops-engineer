import { strapiClient } from "./apollo/apollo-client"; // assuming the client is initialized here
import { USER_IDENTITIES_QUERY, UserIdentitiesResponse, UserIdentity, UserIdentityFiltersInput } from "./gql/LIST_USER_IDENTITES";

// Function to execute the profile exists query
export async function getProfile( email: string ): Promise<UserIdentity | undefined> {
  try {
    const { data } = await strapiClient.query<UserIdentitiesResponse, UserIdentityFiltersInput>( {
      query: USER_IDENTITIES_QUERY,
      variables: {
        filters: {
          email: {
            eq: email.toLowerCase()
          }
        }
      }
    }
    );

    console.log( 'User identity fetched:', data.userIdentities.data[0] );

      return data.userIdentities.data[0] ?? undefined;
  } catch ( error ) {
    console.error( 'An error occurred while fetching chat histories:', error );
    throw new Error(`Failed to fetch user identites for ${email}`);
  }
}
