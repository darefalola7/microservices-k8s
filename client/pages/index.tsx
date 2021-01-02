import React from "react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type Props = {
  currentUser: {
    id: string;
    email: string;
  } | null;
};

const LandingPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  currentUser,
}: Props) => {
  console.log("I am in the component ", currentUser);
  return <div>Landing Page 44</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.log("I was executed");
  // Call an external API endpoint to get data
  const response = await axios.get(
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
    {
      headers: req.headers,
    }
  );

  const currentUser = response.data;

  // By returning { props: users }, the Users component
  // will receive `users` as a prop at build time
  return {
    props: {
      currentUser,
    },
  };
};

export default LandingPage;
