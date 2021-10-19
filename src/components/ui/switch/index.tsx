import React, { FC } from "react";
import classNames from "classnames";

import css from "./switch.module.scss";

interface PropsInterface {
  color: "yellow" | "green";
  isSmallSize?: boolean;
  handleChange?: () => void;
  value: boolean;
  label: string;
}

const Switch: FC<PropsInterface> = ({
  color,
  isSmallSize,
  handleChange,
  value,
  label,
}) => {
  return (
    <div className={css.wrap}>
      <label
        className={classNames(
          "mySwitch",
          css.switch,
          css[color],
          isSmallSize && css.small
        )}
      >
        <input
          value={"str"}
          defaultChecked={value}
          type="checkbox"
          onChange={handleChange}
        />
        <span />
      </label>

      <p>{label}</p>
    </div>
  );
};

export default Switch;
