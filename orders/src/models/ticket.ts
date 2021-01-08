import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

//Interface that describe the properties that are required to create a new user
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the extra properties that a ticket model has
//collection level methods
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

//An interface that describes a properties that a document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved: () => Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

//collection level methods
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

//Document level methods
ticketSchema.methods.isReserved = async function () {
  // Run query to look for an order
  // find order where ticket is the ticket we just found and the order status is not cancelled
  // if we find an order, means the ticket is reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

//create mongoose model
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
