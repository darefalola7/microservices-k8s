import React, { ReactNode, useContext } from "react";
import Header from "./Header";

type Props = {
  currentUser: {
    id: string;
    email: string;
  };
  children?: ReactNode;
};

const Layout: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <Header currentUser={props.currentUser} />
      {props.children}
    </div>
  );
};

export default Layout;
