import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); // this gives current time stamp in milli-second
  const adjExpirationTime = new Date(expirationTime).getTime(); // this will be some time in future

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationTime);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  } // if we pass this if check it mean we have valid token bcs there is enough remaining time so i'll return that stored token and remaining time instead

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

// named export
export const AuthContextProvider = (props) => {
  // responsible for managing auth related state

  const tokenData = retrieveStoredToken();
  let initialToken;
  if (initialToken) {
    // check for if my token has some valid value not null
    initialToken = tokenData.token;
  }

  // Old way of above statements: const initialToken = localStorage.getItem("token"); // whenever sites relaod it should check if there is that token and if its present, use that

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token; // !! converts this truthy or falsy value into boolean true or false, if token is a string that is not empty than it will return true

  const logoutHandler = useCallback(() => {
    // useCallback memoizes our callback functions, so they not recreated on every re-render
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []); // we dont need to add anything bcs it contains browser built in functions and global variables that is outside of react rendering flow

  const loginHandler = (token, expirationTime) => {
    // We have to store this token to persist on page after reloading the page, so we can use either local storage or cookies, here we are going with local storage here. So we have to store our token in browser storage also. And we logout we also have to clear it from logoutHandler function.
    setToken(token);
    localStorage.setItem("token", token); // setItem allows us to store key value pair in that local storage and key up to you (token), and value should be that token
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime); // that will log the user out when this timer expires
  };

  useEffect(() => {
    // this should set the logout handler to the remaining time here if we automaticaly logged in the user
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contexValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contexValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

// default export
export default AuthContext;
