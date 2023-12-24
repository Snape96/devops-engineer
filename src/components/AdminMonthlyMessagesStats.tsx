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

const AdminMonthlyMessagesStats = ({
  usersMonthlyStatistics,
}: {
  usersMonthlyStatistics: MonthUsageStatData[];
}) => {
  const data: Array<UserSerie<Data>> = useMemo(() => {
    const totals: { [total: string]: { [month: string]: number } } = {};
    totals.messages = {};
    totals.chats = {};
    totals.tokens = {};

    for (const item of usersMonthlyStatistics) {
      const monthKey = `${item.attributes.year}-${item.attributes.month}`;

      if (!totals.messages[monthKey]) totals.messages[monthKey] = 0;
      totals.messages[monthKey] += item.attributes.messages_count;

      if (!totals.chats[monthKey]) totals.chats[monthKey] = 0;
      totals.chats[monthKey] += item.attributes.chat_histories_count;

      if (!totals.tokens[monthKey]) totals.tokens[monthKey] = 0;
      totals.tokens[monthKey] += item.attributes.tokens_count;
    }

    const ret: Array<UserSerie<Data>> = [];
    ret.push({
      label: 'Total messages',
      data: Object.keys(totals.messages).map((monthKey) => ({
        month: monthKey,
        value: totals.messages[monthKey],
      })),
    });
    ret.push({
      label: 'Total chats',
      data: Object.keys(totals.chats).map((monthKey) => ({
        month: monthKey,
        value: totals.chats[monthKey],
      })),
    });
    ret.push({
      label: 'Total tokens',
      data: Object.keys(totals.chats).map((monthKey) => ({
        month: monthKey,
        value: totals.tokens[monthKey],
      })),
    });
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
        elementType: 'line',
      },
    ],
    []
  );

  return (
    <>
      <h3>Monthly totals (all users)</h3>
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

export default AdminMonthlyMessagesStats;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 300px;
`;
