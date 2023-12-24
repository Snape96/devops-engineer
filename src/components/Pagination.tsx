import styled from 'styled-components';
import { IconButton } from './IconButton';
import Arrow from './Icons/Arrow';

const Pagination = ({
  page,
  total,
  onPageRequested,
}: {
  page: number;
  total: number;
  onPageRequested: (page: number) => void;
}) => {
  return (
    <Wrapper>
      <IconButton
        type='button'
        disabled={page === 1}
        onClick={() => {
          onPageRequested(page - 1);
        }}
      >
        <Arrow direction='left' />
      </IconButton>
      <p>
        Page {page} of {total}
      </p>
      <IconButton
        type='button'
        disabled={page === total}
        onClick={() => {
          onPageRequested(page + 1);
        }}
      >
        <Arrow direction='right' />
      </IconButton>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  padding: 20px 24px;

  color: ${(props) => props.theme.primary};

  p {
    margin: 0;
  }
`;
