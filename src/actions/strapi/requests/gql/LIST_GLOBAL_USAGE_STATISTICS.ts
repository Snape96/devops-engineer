import { gql } from "@apollo/client";

/**
 * GraphQL query for fetching global usage statistics.
 * It accepts sorting and pagination as variables.
 */
export const LIST_GLOBAL_USAGE_STATISTICS = gql`
  query GlobalUsageStatistics($sort: [String]) {
    globalUsageStatistics(sort: $sort) {
      data {
        attributes {
          budget_spent
          chat_histories_count
          messages_count
          month
          year
        }
      }
    }
  }
`;

/**
 * Interface representing attributes of each record in the statistics.
 */
export interface GlobalUsageStatAttributes {
  budget_spent: number;
  chat_histories_count: number;
  messages_count: number;
  month: number;
  year: number;
}

/**
 * Interface representing data structure of the query response.
 */
export interface GlobalUsageStatData {
  attributes: GlobalUsageStatAttributes;
}

/**
 * Interface representing the whole GraphQL response for this query.
 */
export interface GlobalUsageStatisticsResponse {
  globalUsageStatistics: { data: GlobalUsageStatData[] };
}