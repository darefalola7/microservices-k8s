import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
} from "@dafaltickets/common";
import mongoose from "mongoose";

const setup = async () => {
  //    Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  //  Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 99,
  });
  await ticket.save();

  //create and save an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "wertgfd",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  //  Create the fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //    create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancel", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
