import { gql } from "@apollo/client";
import { UserIdentity } from "./LIST_USER_IDENTITES";

export const UPDATE_USER_IDENTITY = gql`
  mutation UpdateUserIdentity($updateUserIdentityId: ID!, $data: UserIdentityInput!) {
  updateUserIdentity(id: $updateUserIdentityId, data: $data) {
    data {
      id
      attributes {
        is_admin
        has_access
        email
        
          
        
      }
    }
  }
  }
`;
  
  export interface UpdateUserIdentityResponse {
    updateUserIdentity: {
      data: UserIdentity;
    }
  }


export interface UpdateUserIdentityInput {
    updateUserIdentityId: string;
    data: {
      email: string;
      has_access: boolean;
      is_admin: boolean;
      
    };
  }