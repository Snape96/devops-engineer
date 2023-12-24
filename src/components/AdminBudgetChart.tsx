import { GlobalUsageStatData } from '@/actions/strapi/requests/gql/LIST_GLOBAL_USAGE_STATISTICS';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';

/**
 * BudgetChart displays a linear graph that shows budget spent each month.
 *
 * @param {Array} statistics - Array of statistics data.
 */
const AdminBudgetChart: React.FC<{ statistics: GlobalUsageStatData[] }> = ({
  statistics,
}) => {
  const data = statistics.map((stat) => ({
    name: `${stat.attributes.month}-${stat.attributes.year}`,
    budgetSpent: stat.attributes.budget_spent,
  }));

  return (
    <Wrapper>
      <h3>Monthly budget spent</h3>
      <ResponsiveContainer height={475}>
        <LineChart data={data.reverse()}>
          <Line
            type='monotone'
            dataKey='budgetSpent'
            name='Budget spent'
            stroke='#b4d333'
            unit='$'
          />
          <XAxis
            dataKey='name'
            interval='preserveStartEnd'
            label='Month'
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

export default AdminBudgetChart;

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  padding: 24px 0 0;
`;
