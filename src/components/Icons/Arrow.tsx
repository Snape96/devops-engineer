const Arrow = ({
  direction,
}: {
  direction?: 'right' | 'up' | 'left' | 'down';
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='16'
    viewBox='0 0 14 16'
    fill='none'
    style={{
      transform: `rotate(${
        direction === 'up'
          ? '-90deg'
          : direction === 'left'
          ? '-180deg'
          : direction === 'down'
          ? '-270deg'
          : '0deg'
      })`,
    }}
  >
    <path
      d='M13.8531 8.35315C14.0469 8.1594 14.0469 7.84065 13.8531 7.6469L8.35313 2.1469C8.15938 1.95315 7.84063 1.95315 7.64688 2.1469C7.45313 2.34065 7.45313 2.6594 7.64688 2.85315L12.2938 7.50002H0.5C0.225 7.50002 0 7.72502 0 8.00002C0 8.27502 0.225 8.50002 0.5 8.50002H12.2938L7.64688 13.1469C7.45313 13.3406 7.45313 13.6594 7.64688 13.8531C7.84063 14.0469 8.15938 14.0469 8.35313 13.8531L13.8531 8.35315Z'
      fill='currentColor'
    />
  </svg>
);

export default Arrow;
