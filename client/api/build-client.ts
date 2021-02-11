import axios from "axios";
import { IncomingMessage } from "http";

const buildClient = (req: IncomingMessage) => {
  if (typeof window === "undefined") {
    //  we are on server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/",
      headers: req?.headers,
    });
  } else {
    //we are on browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
