import { getStorage } from './storage';

export const authOptions = () => {
  const options = {
    baseURL: `${process.env.REACT_APP_BASE_URL_BACKEND}:${process.env
      .REACT_APP_BASE_URL_BACKEND_PORT}`,
    timeout: 220000,
    crossdomain: true,
    headers: {
      authorization: getStorage('token'),
      'x-access-token': getStorage('token'),
    },
  };

  return options;
};
