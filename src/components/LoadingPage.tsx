import Loader from './Loader';

const LoadingPage = () => {
  return (
    <div
      style={{
        // inline css to prevent flicker on initial page load when styled css are not yet ready
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 64,
        backgroundColor: '#f7f7f7',
      }}
    >
      <Loader size='lg' />
      <h1>Loading...</h1>
    </div>
  );
};

export default LoadingPage;
