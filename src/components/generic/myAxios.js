import { getStorage } from './storage';
export const authOptions = () => {
  const options = {
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 200000,
    headers: {
      authorization: getStorage('token'),
      'x-access-token': getStorage('token'),
    },
  };

  return options;
};
