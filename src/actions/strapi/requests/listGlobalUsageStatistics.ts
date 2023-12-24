import { strapiClient } from "./apollo/apollo-client"; 
import { GlobalUsageStatData, GlobalUsageStatisticsResponse, LIST_GLOBAL_USAGE_STATISTICS } from "./gql/LIST_GLOBAL_USAGE_STATISTICS";

/**
 * Function to execute the globalUsageStatistics query.
 *
 * @returns {Promise<GlobalUsageStatData[] | undefined>} - A promise that resolves to an array of global usage statistics or undefined.
 */
export async function listGlobalUsageStatistics(): Promise<GlobalUsageStatData[]> {
  try {
    const { data } = await strapiClient.query<GlobalUsageStatisticsResponse, { sort: string[] }>({
      query: LIST_GLOBAL_USAGE_STATISTICS,
      variables: {
        sort: ["year:desc", "month:desc"],
      }
    });

    return data?.globalUsageStatistics.data;
  } catch (error) {
    console.error( 'An error occurred while fetching global usage statistics:', error );
    return [];
  }
}
