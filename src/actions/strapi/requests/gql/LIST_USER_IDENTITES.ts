import { gql } from "@apollo/client";

export const USER_IDENTITIES_QUERY = gql`
  query UserIdentities($filters: UserIdentityFiltersInput) {
    userIdentities(filters: $filters) {
      data {
        id
        attributes {
          email
          is_admin
          has_access
        }
      }
    }
  }
`;

export interface UserIdentity {
  id: string;
  attributes: {
    email: string;
    is_admin: boolean;
    has_access: boolean;
  };
}

export interface UserIdentitiesResponse {
  userIdentities: {
    data: UserIdentity[];
  };
}

export interface UserIdentityFiltersInput {
  filters: {
    email: {
      eq: string;
    };
  };
}
