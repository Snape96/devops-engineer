import { gql } from "@apollo/client";
import { UserIdentity } from "./LIST_USER_IDENTITES";

export const CREATE_USER_IDENTITY = gql`
  mutation CreateUserIdentity($data: UserIdentityInput!) {
  createUserIdentity(data: $data) {
    data {
      id
      attributes {
        email
        has_access
        is_admin
      }
    }
  }
}
`;
  
  export interface CreateUserIdentityResponse {
    createUserIdentity: {
      data: UserIdentity;
    }
  }


  export interface CreateUserIdentityInput {
    data: {
      email: string;
      has_access: boolean;
      is_admin: boolean;
      
    };
  }