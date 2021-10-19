import React, { FC } from "react";
import classNames from "classnames";

import css from "./input.module.scss";

interface PropsInterface {
  type: "text" | "password" | "email";
  name?: string;
  placeholder: string;
  register?: any;
  error?: boolean;
}

const Input: FC<PropsInterface> = ({
  type,
  name,
  placeholder,
  register,
  error,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={classNames(css.input, error && css.error)}
      {...register}
    />
  );
};

export default Input;
