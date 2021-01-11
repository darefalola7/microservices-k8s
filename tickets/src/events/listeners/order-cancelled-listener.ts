import { Listener, OrderCancelledEvent, Subjects } from "@dafaltickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    //    Find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //    If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //    Mark the ticket as being free by setting its orderId property as undefined
    ticket.set({ orderId: undefined });
    //    Save the ticket
    await ticket.save();
    //publish event to listeners to indicate change in version
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }

  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
