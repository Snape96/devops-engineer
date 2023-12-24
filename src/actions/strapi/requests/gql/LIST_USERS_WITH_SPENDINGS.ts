import { gql } from "@apollo/client";
import { UserUsageStatisticFiltersInput } from "./LIST_MONTH_USAGE_STATISTICS";
import { UserIdentityFiltersInput } from "./LIST_USER_IDENTITES";

export const LIST_USERS_WITH_SPENDINGS = gql`
  query UserIdentities($filters: UserIdentityFiltersInput, $statisticsFilter: UserUsageStatisticFiltersInput) {
    userIdentities(filters: $filters) {
      data {
        id
        attributes {
          email
          is_admin
          has_access
          user_usage_statistics(filters: $statisticsFilter) {
            data {
              attributes {
                budget_spent
                year
                month
                messages_count
                chat_histories_count
                tokens_count
              }
            }
          }
        }
      }
    }
  }
`;

export interface UserIdentityWithSpendings {
    id: string;
    attributes: {
        email: string;
        is_admin: boolean;
        has_access: boolean;
      user_usage_statistics: { data: UserMonthSpending[] };
    };
}
  
  export interface UserIdentitiesWithSpendingResponse {
    userIdentities: {
      data: UserIdentityWithSpendings[];
    };
}
  
export interface UserMonthSpending {
  attributes: {
    budget_spent: number;
    chat_histories_count: number;
    messages_count: number;
    month: number;
    year: number;
    tokens_count: number;
  };
}
  
export interface ListUsersWithSpendingsInput {
    statisticsFilter: { and: AndCondition[] };
    
}

/**
 * Interface representing the structure of equality-based filters for a single property.
 */
interface EqualityFilter {
    eq: number;
  }
  
  /**
   * Interface representing the structure of month and year filters within a single AND condition.
   */
  interface AndCondition {
    month?: EqualityFilter;
    year?: EqualityFilter;
  }