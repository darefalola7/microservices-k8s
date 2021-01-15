import { NextPage, NextPageContext } from "next";

type Props = {
  orders: {
    id: string;
    ticket: {
      title: string;
    };
    status: string;
  }[];
};

// @ts-ignore
const OrderIndex: NextPage<Props> = (props: Props) => {
  return (
    <ul>
      {props.orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

// @ts-ignore
OrderIndex.getInitialProps = async (
  context: NextPageContext,
  client,
  currentUser
) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
