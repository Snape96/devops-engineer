import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GlobalUsageStatData } from '@/actions/strapi/requests/gql/LIST_GLOBAL_USAGE_STATISTICS';
import { MonthUsageStatData } from '@/actions/strapi/requests/gql/LIST_MONTH_USAGE_STATISTICS';
import { listMonthUsageStatistics } from '@/actions/strapi/requests/listMonthUsageStatistics';
import styled from 'styled-components';

/**
 * Generates a deterministic color based on a string.
 *
 * @param {string} str - The string to generate a color from.
 * @returns {string} The generated color as a hex string.
 */
const getStringColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

/**
 * AdminStatisticsDetails is a functional component that displays detailed statistics for a selected month.
 *
 * @param {GlobalUsageStatData | null} stat - The selected month's statistics.
 */
const AdminStatisticsDetails: React.FC<{
  stat: GlobalUsageStatData | null;
}> = ({ stat }) => {
  const [usersMonthlyStatistics, setUsersMonthlyStatistics] = useState<
    MonthUsageStatData[]
  >([]);

  // Fetch user statistics on month selection
  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (stat) {
        const statistics = await listMonthUsageStatistics(
          stat.attributes.year,
          stat.attributes.month
        );
        setUsersMonthlyStatistics(statistics ?? []);
      }
    };

    fetchUserStatistics();
  }, [stat]);

  // Prepare the data for the PieChart
  const pieData = usersMonthlyStatistics.map((e) => ({
    id: e.attributes.user_identity.data.id,
    name: e.attributes.user_identity.data.attributes.email,
    value: e.attributes.budget_spent,
  }));

  if (!stat) return <div>Select a month to view statistics.</div>;

  return (
    <Wrapper>
      <h3>
        Statistics for {stat.attributes.year} - {stat.attributes.month}
      </h3>
      <p>Messages Sent: {stat.attributes.messages_count}</p>
      <p>Chats Created: {stat.attributes.chat_histories_count}</p>
      <p>Total Budget Spent: ${stat.attributes.budget_spent.toFixed(3)}</p>

      <h3>User-wise Budget Spent in $</h3>
      <ResponsiveContainer height={300} width={'100%'}>
        <PieChart>
          <Pie
            data={pieData}
            cx={'50%'}
            cy={'50%'}
            labelLine={true}
            fill='#b4d333'
            dataKey='value'
            label={({ name, value }) =>
              value >= 0.01 ? `$${value.toFixed(4)}` : '<=$0.01'
            }
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${entry.id}`}
                fill={getStringColor(entry.name) || '#000'}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

export default AdminStatisticsDetails;

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;

  padding: 16px 24px;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 9px;
`;
