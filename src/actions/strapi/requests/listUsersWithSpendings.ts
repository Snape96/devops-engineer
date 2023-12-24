import { strapiClient } from "./apollo/apollo-client";
import { LIST_USERS_WITH_SPENDINGS, ListUsersWithSpendingsInput, UserIdentitiesWithSpendingResponse, UserIdentityWithSpendings } from "./gql/LIST_USERS_WITH_SPENDINGS";

export async function listUsersWithSpendings(year: number, month: number, forceNetwork: boolean = false): Promise<UserIdentityWithSpendings[] | undefined> {
    try {
    const fetchPolicyString = forceNetwork ? 'network-only' : 'cache-first';
      
      const { data } = await strapiClient.query<UserIdentitiesWithSpendingResponse, ListUsersWithSpendingsInput>( {
          query: LIST_USERS_WITH_SPENDINGS,
          fetchPolicy: fetchPolicyString,
          variables: {
            statisticsFilter: {
                  and: [
                      {
                          month: {
                              eq: month
                          }
                      },
                      {
                          year: {
                              eq: year
                          }
                      }
                  ]
              }
          }
      } );

    return data?.userIdentities.data;
  } catch (error) {
    console.error('An error occurred while fetching users with statistics:', error);
    return undefined;
  }
}
