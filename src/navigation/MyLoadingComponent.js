import React from 'react';
import MyLoader from '../components/generic/myLoader';

const MyLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <MyLoader />;
  } else if (error) {
    // Handle the error state
    return <div>Desculpe, houve um problema ao carregar a página.</div>;
  }
  return null;
};
export default MyLoadingComponent;
