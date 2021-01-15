import React, { useEffect, useContext } from "react";
import { UserContext } from "../_app";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Layout from "../../components/Layout";

type Props = {};

const SignOut: React.FC<Props> = (props: Props) => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const userContextData = useContext(UserContext);
  const { user } = userContextData;
  useEffect(() => {
    doRequest();
    userContextData.setUser(undefined);
  }, []);

  console.log(user);

  return (
    <Layout currentUser={user}>
      <div>Signing you out...</div>
    </Layout>
  );
};

export default SignOut;
