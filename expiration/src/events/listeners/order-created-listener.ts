import { Listener, OrderCreatedEvent, Subjects } from "@dafaltickets/common";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queues/expiration-queue";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting for: ", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      // { delay }
    );
    //    ack the message
    msg.ack();
  }
}
