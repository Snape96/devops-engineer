// components/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AdminMonthlyUsageStats from './AdminMonthlyUsageStats';
import { MonthUsageStatData } from '@/actions/strapi/requests/gql/LIST_MONTH_USAGE_STATISTICS';
import { listMonthUsageStatistics } from '@/actions/strapi/requests/listMonthUsageStatistics';
import AdminMonthlyMessagesStats from './AdminMonthlyMessagesStats';

/**
 * AdminDashboard is the main functional component for the dashboard.
 */
const AdminDashboard: React.FC = () => {
  const [usersMonthlyStatistics, setUsersMonthlyStatistics] = useState<
    MonthUsageStatData[]
  >([]);

  // Fetch user statistics on month selection
  useEffect(() => {
    const fetchUserStatistics = async () => {
      const statistics = await listMonthUsageStatistics();
      setUsersMonthlyStatistics(statistics ?? []);
    };

    fetchUserStatistics();
  }, []);
  return (
    <DashboardContainer>
      <AreaMessages>
        <AdminMonthlyMessagesStats
          usersMonthlyStatistics={usersMonthlyStatistics}
        />
      </AreaMessages>
      <AreaUsage>
        <AdminMonthlyUsageStats
          usersMonthlyStatistics={usersMonthlyStatistics}
        />
      </AreaUsage>
    </DashboardContainer>
  );
};

export default AdminDashboard;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'messages usage';
  gap: 32px;

  @media (max-width: 1000px) {
    display: block;
  }
`;

const AreaMessages = styled.div`
  grid-area: messages;
`;

const AreaUsage = styled.div`
  grid-area: usage;
`;
