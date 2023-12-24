import { strapiClient } from './apollo/apollo-client';
import {
  MonthUsageStatData,
  MonthUsageStatisticsResponse,
  LIST_MONTH_USAGE_STATISTICS,
  UserUsageStatisticFiltersInput,
} from './gql/LIST_MONTH_USAGE_STATISTICS';

/**
 * Function to execute the userUsageStatistics query based on month and year filters.
 *
 * @param {Object} filters - Object containing filter criteria (month and year) for the query.
 * @returns {Promise<MonthUsageStatData[] | undefined>} - A promise that resolves to an array of monthly usage statistics for all users or undefined.
 */
export async function listMonthUsageStatistics(
  year?: number,
  month?: number
): Promise<MonthUsageStatData[] | undefined> {
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth() + 1;

  try {
    const { data } = await strapiClient.query<
      MonthUsageStatisticsResponse,
      UserUsageStatisticFiltersInput
    >({
      query: LIST_MONTH_USAGE_STATISTICS,
      variables: {
        filters:
          year && month
            ? {
                and: [
                  {
                    month: {
                      eq: month,
                    },
                  },
                  {
                    year: {
                      eq: year,
                    },
                  },
                ],
              }
            : currMonth === 12
            ? {
                year: {
                  eq: currYear,
                },
              }
            : {
                or: [
                  {
                    and: [
                      {
                        month: {
                          gte: currMonth + 1,
                        },
                        year: {
                          eq: currYear - 1,
                        },
                      },
                    ],
                  },
                  {
                    year: {
                      eq: currYear,
                    },
                  },
                ],
              },
      },
    });

    return data?.userUsageStatistics.data;
  } catch (error) {
    console.error(
      'An error occurred while fetching monthly usage statistics:',
      error
    );
    return undefined;
  }
}
