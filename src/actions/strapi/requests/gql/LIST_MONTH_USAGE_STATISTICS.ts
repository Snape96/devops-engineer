import { gql } from '@apollo/client';

/**
 * GraphQL query for fetching usage statistics for all users for a specific month and year.
 * Accepts a `UserUsageStatisticFiltersInput` for filtering by month and year.
 */
export const LIST_MONTH_USAGE_STATISTICS = gql`
  query Data($filters: UserUsageStatisticFiltersInput) {
    userUsageStatistics(filters: $filters) {
      data {
        attributes {
          budget_spent
          chat_histories_count
          messages_count
          month
          year
          tokens_count
          user_identity {
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
      }
    }
  }
`;

/**
 * Interface representing the structure of equality-based filters for a single property.
 */
interface EqualityFilter {
  eq: number;
}

interface GreaterEquealFilter {
  gte: number;
}

/**
 * Interface representing the structure of month and year filters within a single AND condition.
 */
interface AndCondition {
  month?: EqualityFilter | GreaterEquealFilter;
  year?: EqualityFilter | GreaterEquealFilter;
}

interface OrCondition {
  and?: AndCondition[];
  year?: EqualityFilter;
}

/**
 * Interface representing the structure of the filters to apply to the user usage statistics query.
 */
export interface UserUsageStatisticFiltersInput {
  filters: { and?: AndCondition[]; or?: OrCondition[]; year?: EqualityFilter };
}

/**
 * Interface representing attributes of each record in the statistics.
 */
export interface MonthUsageStatAttributes {
  budget_spent: number;
  chat_histories_count: number;
  messages_count: number;
  month: number;
  year: number;
  tokens_count: number;
  user_identity: {
    data: {
      id: string;
      attributes: {
        email: string;
        has_access: boolean;
        is_admin: boolean;
      };
    };
  };
}

/**
 * Interface representing data structure of the query response.
 */
export interface MonthUsageStatData {
  attributes: MonthUsageStatAttributes;
}

/**
 * Interface representing the whole GraphQL response for this query.
 */
export interface MonthUsageStatisticsResponse {
  userUsageStatistics: { data: MonthUsageStatData[] };
}
