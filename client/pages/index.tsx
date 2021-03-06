import React, { useContext } from "react";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
// import { UserContext } from "./_app";

type Props = {
  tickets: {
    title: string;
    price: number;
    id: string;
  }[];
};

// @ts-ignore
const LandingPage: NextPage<{ Props }> = ({ tickets }: Props) => {
  // const userContextData = useContext(UserContext);
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Buy your favourite Tickets!</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// @ts-ignore
LandingPage.getInitialProps = async (
  context: NextPageContext,
  client,
  currentUser
) => {
  try {
    const { data } = await client.get("/api/tickets");
    return { tickets: data };
  } catch (e) {
    console.log(e);
  }
};

export default LandingPage;
