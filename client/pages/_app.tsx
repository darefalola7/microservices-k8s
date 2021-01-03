//Component wrapper for all components
//useful for global styles
import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";

let user: {
  id: string;
  email: string;
} | null = null;

export const UserContext = React.createContext(user);
console.log("Executed _app1");
const MyApp = ({ Component, pageProps }: AppProps) => {
  const getData = async () => {
    const response = await fetch("/api/users/currentuser");
    return await response.json();
  };

  useEffect(() => {
    console.log("Executed _app2");
    getData().then((data) => {
      user = data;
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default MyApp;
