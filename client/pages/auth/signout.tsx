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

  const user = useContext(UserContext);
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <Layout currentUser={user}>
      <div>Signing you out...</div>
    </Layout>
  );
};

export default SignOut;
