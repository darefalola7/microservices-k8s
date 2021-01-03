import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT KEY must be defined!!!");
  }

  try {
    await mongoose.connect(
      "mongodb://auth-mongo-cluster-ip-service:27017/auth",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to Mongo DB");
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => {
    console.log("V001");
    console.log("Listening on 3000");
  });
};

start();
