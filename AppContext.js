// AppContext.js
import React, { createContext } from 'react';

export const AppContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});
