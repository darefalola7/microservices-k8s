import { Publisher, Subjects, OrderCreatedEvent } from "@dafaltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
