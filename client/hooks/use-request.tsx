import axios from "axios";
import React, { useState } from "react";

type HTTPVERBS = "get" | "post" | "put" | "delete";

type Props = {
  url: string;
  method: HTTPVERBS;
  body?: any;
  onSuccess?: (data?: any) => void;
};

const useRequest = ({ url, method, body, onSuccess }: Props) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method as string](url, {
        ...body,
        ...props,
      });

      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (e) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {e.response.data.errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
