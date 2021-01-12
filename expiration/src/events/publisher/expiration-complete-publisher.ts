import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@dafaltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
