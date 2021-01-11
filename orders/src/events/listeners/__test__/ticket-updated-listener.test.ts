import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@dafaltickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  //    Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //    Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  //    Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
    title: "new concert",
    price: 99,
  };
  //    Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  //    call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //    write assertions to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  //Set version ot the future
  data.version = 10;

  try {
    //    call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
  } catch (e) {
    // console.log(e);
  }

  //    write assertions to make sure ack is called
  expect(msg.ack).not.toHaveBeenCalled();
});
