import dotenv from "dotenv";
import mongoose from "mongoose";
const result = dotenv.config();

if (result.error) {
  console.log(result.error);
}

import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  console.log("Booting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT KEY must be defined!!!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined!!!");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined!!!");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined!!!");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined!!!");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(0);
    });
    process.on("SIGINT", () => {
      natsWrapper.client.close();
    });

    process.on("SIGTERM", () => {
      natsWrapper.client.close();
    });
    process.on("SIGBREAK", () => {
      natsWrapper.client.close();
    });

    await new OrderCancelledListener(natsWrapper.client).listen();
    await new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo DB");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log("Payments 002");
    console.log("Listening on 3000");
  });
};

start();
