import React, { FC } from "react";
import Image from "next/image";

import css from "./logo.module.scss";
import classNames from "classnames";

const Logo: FC<{ showInDesktop: boolean }> = ({ showInDesktop }) => {
  return (
    <div className={classNames(css.logo, showInDesktop && css.showInDesk)}>
      <Image layout="fill" src="/img/logo.svg" alt="vigilance cockpit" />
    </div>
  );
};

export default Logo;
