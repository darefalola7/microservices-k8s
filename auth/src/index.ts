import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Booting up...");

  console.log(process.env.MONGO_URI);
  console.log(process.env.JWT_KEY);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined!!!");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT KEY must be defined!!!");
  }

  try {
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
    console.log("Auth002");
    console.log("Listening on 3000");
  });
};

start();
