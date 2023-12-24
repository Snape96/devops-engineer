import { GlobalUsageStatData } from '@/actions/strapi/requests/gql/LIST_GLOBAL_USAGE_STATISTICS';
import React from 'react';
import styled from 'styled-components';
import Button from './Button';

/**
 * MonthList functional component
 * @param {GlobalUsageStatData[]} stats - Statistics for each month.
 */
const AdminMonthList: React.FC<{
  stats: GlobalUsageStatData[];
  selected: GlobalUsageStatData | null;
  onSelect: (stat: GlobalUsageStatData) => void;
}> = ({ stats, selected, onSelect }) => {
  return (
    <Wrapper>
      <Ul>
        {stats.map((stat, index) => (
          <li key={index}>
            <MonthButton
              type='button'
              onClick={() => onSelect(stat)}
              selected={selected === stat}
            >
              {stat.attributes.year} - {stat.attributes.month}
            </MonthButton>
          </li>
        ))}
      </Ul>
    </Wrapper>
  );
};

export default AdminMonthList;

const Wrapper = styled.div``;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  padding: 0;
  margin: 0;

  list-style: none;

  @media (max-width: 1000px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const MonthButton = styled(Button)<{ selected: boolean }>`
  width: 16rem;

  background-color: ${(props) =>
    props.selected ? props.theme.accent : '#ffffff'};
  color: ${(props) => props.theme.primary};
`;
