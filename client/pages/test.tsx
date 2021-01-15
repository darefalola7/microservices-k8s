import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./_app";

type Props = {};

const Test: React.FC<Props> = (props: Props) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <p>
        {" "}
        {user === undefined
          ? "Not signed in"
          : `Details: ${user?.email} - ${user?.id}`}
      </p>
    </div>
  );
};

export default Test;
