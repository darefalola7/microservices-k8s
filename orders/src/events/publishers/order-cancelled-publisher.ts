import { Publisher, Subjects, OrderCancelledEvent } from "@dafaltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
