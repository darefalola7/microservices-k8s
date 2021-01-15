import mongoose from "mongoose";
import { OrderStatus } from "@dafaltickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//Interface that describe the properties that are required to create a new user
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// An interface that describes the extra properties that a order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

//An interface that describes a properties that a user document has
interface OrderDoc extends mongoose.Document {
  //id is automatically listed by mongo
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ordersSchema.set("versionKey", "version");
ordersSchema.plugin(updateIfCurrentPlugin);

//purposefully setting the _id, because this data is replicated from other services
//this allows each document have consistent ids between microservices
ordersSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", ordersSchema);

export { Order };
