//Component wrapper for all components
//useful for global styles
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppContext, AppProps } from "next/app";

import buildClient from "../api/build-client";
import Header from "../components/Header";

type User =
  | {
      id: string;
      email: string;
    }
  | undefined;

const userContextData: {
  user: User;
  setUser: (user: User) => void;
} = {
  user: undefined,
  setUser(data) {
    this.user = data;
  },
};

export const UserContext = React.createContext(userContextData);
console.log("Executed _app1");

// @ts-ignore
const MyApp = ({ Component, pageProps, props }: AppProps) => {
  let userdata: User = undefined;
  if (props.currentUser) {
    userdata = {
      email: props?.currentUser?.email,
      id: props?.currentUser?.id,
    };
  }

  userContextData.setUser(userdata);

  return (
    <UserContext.Provider value={userContextData}>
      <Header currentUser={userdata} />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </UserContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  console.log("getInitialProps: I was executed");
  // Call an external API endpoint to get data
  const client = buildClient(appContext.ctx.req);
  let response;
  try {
    response = await client.get("/api/users/currentuser");
  } catch (e) {
    console.log(e.message);
  }
  const currentUser = response.data;

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      // @ts-ignore
      client,
      currentUser
    );
  }

  return {
    pageProps,
    props: {
      ...currentUser,
    },
  };
};

export default MyApp;
