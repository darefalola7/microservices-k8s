import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT KEY must be defined!!!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined!!!");
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      "ertzu2345",
      "http://nats-cluster-ip-service:4222"
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
    console.log("T001");
    console.log("Listening on 3000");
  });
};

start();
