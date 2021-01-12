import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

//information stored inside the job
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//when job is released from redis
expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
