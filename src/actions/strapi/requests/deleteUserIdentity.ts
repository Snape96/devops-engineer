import { strapiClient } from "./apollo/apollo-client";
import { CREATE_USER_IDENTITY, CreateUserIdentityInput, CreateUserIdentityResponse } from "./gql/CREATE_USER_IDENTITY";
import { DELETE_USER_IDENTITY, DeleteUserIdentityInput, DeleteUserIdentityResponse } from "./gql/DELETE_USER_IDENTITY";
import { UserIdentity } from "./gql/LIST_USER_IDENTITES";

export async function deleteUserIdentity(id: string) {
  try {
      const { data } = await strapiClient.mutate<DeleteUserIdentityResponse, DeleteUserIdentityInput>( {
          mutation: DELETE_USER_IDENTITY,
          variables: {
              deleteUserIdentityId: id
          },
      } );

    console.log('User identity created:', data);

    return data?.deleteUserIdentity.data.id;
  } catch (error) {
    console.error('An error occurred while creating chat part:', error);
  }
}
