import { Listener, OrderCreatedEvent, Subjects } from "@dafaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    //  acks the message
    msg.ack();
  }

  queueGroupName = queueGroupName;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
