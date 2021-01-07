import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock("../nats-wrapper");
let mongo: MongoMemoryServer;

//Hook function - runs before all our tests is tested
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  //clear all mocks and reset it, to avoid pollution before other tests
  jest.clearAllMocks();
  //reach into mongo db and delete all collections
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload { id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //  Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //  Build session object { jwt: myjwt }
  const session = { jwt: token };
  //  Turn that to JSON
  const sessionJSON = JSON.stringify(session);
  //  Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //  return a string that the cookie with encoded data
  return [`express:sess=${base64}`];
};
