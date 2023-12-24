import { strapiClient } from "./apollo/apollo-client";
import { UserIdentity } from "./gql/LIST_USER_IDENTITES";
import { UPDATE_USER_IDENTITY, UpdateUserIdentityInput, UpdateUserIdentityResponse } from "./gql/UPDATE_USER_IDENTITY";

export async function updateUserIdentity( userId: string, isAdmin: boolean, hasAccess: boolean, email: string ): Promise<UserIdentity | undefined> {
    try {
        const { data } = await strapiClient.mutate<UpdateUserIdentityResponse, UpdateUserIdentityInput>( {
            mutation: UPDATE_USER_IDENTITY,

            variables: {
                updateUserIdentityId: userId,
                data: {
                    is_admin: isAdmin,
                    has_access: hasAccess,
                    email: email
                },
            },
        } );
      
        console.log( 'User edit:', data?.updateUserIdentity.data );
        
        return data?.updateUserIdentity.data;
    } catch ( error ) {
        console.error( 'An error occurred while updating user:', error );
    }
}