import { strapiClient } from "./apollo/apollo-client";
import { CREATE_USER_IDENTITY, CreateUserIdentityInput, CreateUserIdentityResponse } from "./gql/CREATE_USER_IDENTITY";
import { UserIdentity } from "./gql/LIST_USER_IDENTITES";

export async function createUserIdentity(email: string) {
  try {
      const { data } = await strapiClient.mutate<CreateUserIdentityResponse, CreateUserIdentityInput>( {
          mutation: CREATE_USER_IDENTITY,
          variables: {
              data: {
                  email,
                  is_admin: false,
                  has_access: true
              },
          },
      } );

    console.log('User identity created:', data);

    return data?.createUserIdentity.data as UserIdentity;
  } catch (error) {
    console.error('An error occurred while creating chat part:', error);
  }
}
