import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
} from "@dafaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  async onMessage(
    data: ExpirationCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found!");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    //acknowledge message
    msg.ack();
  }

  queueGroupName: string = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
