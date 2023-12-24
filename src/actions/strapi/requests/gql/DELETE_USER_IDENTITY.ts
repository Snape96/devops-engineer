// DELETE_USER_IDENTITY.ts (assuming you have a gql folder)

import gql from 'graphql-tag';

export const DELETE_USER_IDENTITY = gql`
  mutation DeleteUserIdentity($deleteUserIdentityId: ID!) {
    deleteUserIdentity(id: $deleteUserIdentityId) {
        data {
            id
        }
    }
  }
`;

export interface DeleteUserIdentityResponse {
  deleteUserIdentity: {
    data: { id: string };
  };
}

export interface DeleteUserIdentityInput {
    deleteUserIdentityId: string
}