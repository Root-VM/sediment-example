import React, { FC, useState } from "react";
import classNames from "classnames";

import css from "./check.module.scss";

interface PropsInterface {
  name?: string;
  label: any;
  disable?: boolean;
  isChecked?: boolean;
  handleChange?: (e: any) => void;
  register?: any;
  error?: boolean;
}

const Check: FC<PropsInterface> = ({
  name,
  register,
  error,
  label,
  disable = false,
  isChecked = false,
  handleChange,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    !disable && setChecked(e.target.checked);
    !disable && handleChange && handleChange(e.target.checked);
  };

  return (
    <div className={classNames("myCheck", css.check, error && css.error)}>
      <div className={css.img}>
        <img
          src={`/img/icons/check${
            checked ? (disable ? "-disable" : "-active") : ""
          }.svg`}
          alt="check"
        />
      </div>

      <input
        type="checkbox"
        id={name}
        defaultChecked={checked}
        onChange={(e) => handleRadioChange(e)}
        disabled={disable}
        {...register}
      />

      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default Check;
