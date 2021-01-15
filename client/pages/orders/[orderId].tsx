import { NextPage, NextPageContext } from "next";
import { useContext, useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { UserContext } from "../_app";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

type Props = {
  order: {
    expiresAt: string;
    status: string;
    id: string;
    ticket: { title: string; price: number; id: string };
  };
};

// @ts-ignore
const OrderShow: NextPage<Props> = ({ order }: Props) => {
  let msLeft = 0;
  const [timeLeft, setTimeLeft] = useState(0);
  const userContextData = useContext(UserContext);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => {
          // console.log(token);
          doRequest({ token: id });
        }}
        stripeKey={
          "pk_test_51HSWbvGJa6NMSwmlO58MZOnmWPuupOOqvZAm7SlVmHD1mhS8dKwzZTtxv7EnM4XEgWuh1WiRb40y3sQ77SwJItn500pvaiiC76"
        }
        amount={order.ticket.price * 100}
        email={userContextData.user.email}
      />
    </div>
  );
};

// @ts-ignore
OrderShow.getInitialProps = async (
  context: NextPageContext,
  client,
  currentUser
) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
