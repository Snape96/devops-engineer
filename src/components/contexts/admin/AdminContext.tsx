'use client';
import { GlobalUsageStatData } from '@/actions/strapi/requests/gql/LIST_GLOBAL_USAGE_STATISTICS';
import { UserIdentityWithSpendings } from '@/actions/strapi/requests/gql/LIST_USERS_WITH_SPENDINGS';
import { listGlobalUsageStatistics } from '@/actions/strapi/requests/listGlobalUsageStatistics';
import { listUsersWithSpendings } from '@/actions/strapi/requests/listUsersWithSpendings';
import { createContext, useContext, useState, useEffect } from 'react';

export interface AdminContextData {
  users: UserIdentityWithSpendings[];
  fetchUsers: (
    thisYear?: number,
    thisMonth?: number,
    forceNetwork?: boolean
  ) => Promise<void>;
  statistics: GlobalUsageStatData[];
  selectedMonth: GlobalUsageStatData | null;
  setSelectedMonth: React.Dispatch<
    React.SetStateAction<GlobalUsageStatData | null>
  >;
  usersLoading: boolean;
  statisticsLoading: boolean;
}

// Initialize the context with an empty object
const AdminContext = createContext<AdminContextData>({} as AdminContextData);

export const AdminContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserIdentityWithSpendings[]>([]);
  const [statistics, setStatistics] = useState<GlobalUsageStatData[]>([]);
  const [selectedMonth, setSelectedMonth] =
    useState<GlobalUsageStatData | null>(null);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(false);

  /**
   * Fetches the user list with data of current year and month
   */
  const fetchUsers = async (
    thisYear?: number,
    thisMonth?: number,
    forceNetwork: boolean = false
  ) => {
    let year;
    let month;
    if (thisYear && thisMonth) {
      // TODO year month
      year = thisYear;
      month = thisMonth;
    } else {
      year = new Date().getFullYear();
      month = new Date().getMonth() + 1;
    }

    setUsersLoading(true);
    const fetchedUsers = await listUsersWithSpendings(
      year,
      month,
      forceNetwork
    );
    setUsers(fetchedUsers ?? []);
    setUsersLoading(false);
  };

  /**
   * Fetches the global usage statistics and sets it in local state.
   */
  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    const fetchedStatistics = await listGlobalUsageStatistics();
    setStatistics(fetchedStatistics);
    if (fetchedStatistics.length > 1) setSelectedMonth(fetchedStatistics[0]);
    else setSelectedMonth(null);
    setStatisticsLoading(false);
  };

  useEffect(() => {
    fetchStatistics();
    fetchUsers();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        fetchUsers,
        statistics,
        selectedMonth,
        setSelectedMonth,
        statisticsLoading,
        usersLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
