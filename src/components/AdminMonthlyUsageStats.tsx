import { MonthUsageStatData } from '@/actions/strapi/requests/gql/LIST_MONTH_USAGE_STATISTICS';
import { listMonthUsageStatistics } from '@/actions/strapi/requests/listMonthUsageStatistics';
import { useEffect, useMemo, useState } from 'react';
import {
  AxisOptions,
  AxisBandOptions,
  UserSerie,
} from 'react-charts/types/types';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Loader from './Loader';

const Chart = dynamic(
  () => import('react-charts').then((mod) => mod.Chart<Data>),
  {
    ssr: false,
  }
);

type Data = {
  value: number;
  month: string;
};

const AdminMonthlyUsageStats = ({
  usersMonthlyStatistics,
}: {
  usersMonthlyStatistics: MonthUsageStatData[];
}) => {
  const data: Array<UserSerie<Data>> = useMemo(() => {
    const users: { [user: string]: UserSerie<Data> } = {};

    for (const item of usersMonthlyStatistics) {
      const user = item.attributes.user_identity.data.attributes.email;
      const monthKey = `${item.attributes.year}-${item.attributes.month}`;
      if (!users[user])
        users[user] = {
          label: user,
          data: [],
        };

      users[user].data.push({
        value: item.attributes.budget_spent,
        month: monthKey,
      });
    }

    const ret: Array<UserSerie<Data>> = [];

    for (const user of Object.keys(users)) {
      users[user].data = users[user].data.sort((a, b) =>
        a.month.localeCompare(b.month)
      );
      ret.push(users[user]);
    }
    return ret;
  }, [usersMonthlyStatistics]);

  const primaryAxis = useMemo<
    AxisOptions<(typeof data)[number]['data'][number]>
  >(
    () => ({
      getValue: (item) => item.month,
    }),
    []
  );

  const secondaryAxes = useMemo<
    AxisBandOptions<(typeof data)[number]['data'][number]>[]
  >(
    () => [
      {
        getValue: (item) => item.value,
        elementType: 'bar',
        stacked: true,
        formatters: {
          tooltip: (value) => {
            return `$${parseInt(value?.toString() ?? '0').toFixed(3)}`;
          },
          scale: (value) => {
            return `$${parseInt(value?.toString() ?? '0').toFixed(3)}`;
          },
        },
      },
    ],
    []
  );

  return (
    <>
      <h3>Monthly spending by user</h3>
      <Wrapper>
        {data && data.length > 0 && data[0].data.length > 0 ? (
          <Chart
            options={{
              data: data,
              primaryAxis: primaryAxis,
              secondaryAxes: secondaryAxes,
            }}
          />
        ) : (
          <>
            <Loader size='lg' />
          </>
        )}
      </Wrapper>
    </>
  );
};

export default AdminMonthlyUsageStats;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 300px;
`;
