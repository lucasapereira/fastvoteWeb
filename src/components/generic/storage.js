/*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
export const removeStorage = (name) => {
  try {
    /* eslint no-undef : 0 */
    localStorage.removeItem(name);
    localStorage.removeItem(`${name}_expiresIn`);
  } catch (e) {
    return false;
  }
  return true;
};
/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
export const getStorage = (key) => {
  const now = Date.now(); // epoch time, lets deal only with integer
  // set expiration for storage
  let expiresIn = localStorage.getItem(`${key}_expiresIn`);
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0;
  }

  if (expiresIn < now) {
    // Expired
    removeStorage(key);
    return null;
  }
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (e) {
    return null;
  }
};
/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */
export const setStorage = (key, value, expires) => {
  if (expires === undefined || expires === null) {
    expires = 60 * 60 * 60; // default: seconds for 1 hour
  } else {
    expires = Math.abs(expires); // make sure it's positive
  }

  const now = Date.now(); // millisecs since epoch time, lets deal only with integer
  const schedule = now + expires * 1000;
  try {
    localStorage.setItem(key, value);
    localStorage.setItem(`${key}_expiresIn`, schedule);
  } catch (e) {
    return false;
  }
  return true;
};
