import { NextPage, NextPageContext } from "next";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

type Props = {
  ticket: {
    title: string;
    price: string;
    id: string;
  };
};

// @ts-ignore
const TicketShow: NextPage<Props> = ({ ticket }: Props) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket?.title}</h1>
      <h4>Price: {ticket?.price}</h4>
      {errors}
      <button
        onClick={() => {
          doRequest();
        }}
        className="btn btn-primary"
      >
        Purchase
      </button>
    </div>
  );
};

// @ts-ignore
TicketShow.getInitialProps = async (
  context: NextPageContext,
  client,
  currentUser
) => {
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return {
    ticket: data,
  };
};

export default TicketShow;
