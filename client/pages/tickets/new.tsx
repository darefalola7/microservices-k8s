import { NextPage } from "next";
import { FormEvent, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
type Props = {};

// @ts-ignore
const NewTicket: NextPage<Props> = (props: Props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create new ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="Title">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Title">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className="form-control"
            type="text"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

// @ts-ignore
// NewTicket.getInitialProps = async (
//   context: NextPageContext,
//   client,
//   currentUser
// ) => {
//   console.log("NewTicket.getInitialProps : I was executed");
//
//   return {};
// };

export default NewTicket;
