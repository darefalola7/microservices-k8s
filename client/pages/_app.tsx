//Component wrapper for all components
//useful for global styles

import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps /*, AppContext */ } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
