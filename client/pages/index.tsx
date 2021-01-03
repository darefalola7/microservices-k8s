import React from "react";
import buildClient from "../api/build-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "../components/Layout";

type Props = {
  data: {
    currentUser: {
      id: string;
      email: string;
    } | null;
  };
};

const LandingPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  data: { currentUser },
}: Props) => {
  console.log("I am in the component ", currentUser);
  return (
    <Layout currentUser={currentUser}>
      <div>
        {currentUser ? (
          <h1>You are signed in</h1>
        ) : (
          <h1>You are NOT signed in</h1>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("I was executed");
  // Call an external API endpoint to get data
  const response = await buildClient(context).get("/api/users/currentuser");
  const currentUser = response.data;

  // console.log(currentUser);
  // By returning { props: users }, the Users component
  // will receive `users` as a prop at build time
  return {
    props: {
      data: currentUser,
    },
  };
};

export default LandingPage;
