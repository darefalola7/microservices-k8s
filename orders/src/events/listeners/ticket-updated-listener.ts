import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@dafaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;
    //find ticket with version less than one to indicate correct version
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
