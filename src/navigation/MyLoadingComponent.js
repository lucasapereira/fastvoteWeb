import React from 'react';

const MyLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    // Handle the error state
    return <div>Desculpe, houve um problema ao carregar a página.</div>;
  }
  return null;
};
export default MyLoadingComponent;
