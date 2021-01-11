import { Listener, OrderCreatedEvent, Subjects } from "@dafaltickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    //    Find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //    If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    //    Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
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
    //    ack the message
    msg.ack();
  }
}
