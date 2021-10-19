import React, { FC, useRef, useState } from "react";
import Link from "next/link";
import PopoverWrap from "../popoverWrap";

import css from "./offline-box.module.scss";

const OfflineBox: FC<{ count?: number }> = ({ count }) => {
  const offlineInfo = (
    <div className={css.offlineInfo}>
      <div className={css.line}>
        <p>Info</p>
        <p>
          <span /> Offline
        </p>
      </div>

      <p>
        Bitte prüfen Sie den Strom und die WiFi-Verbindung. <br /> <br />
        Führen Sie anschliessend einen manuellen Neustart des Geräts durch in
        dem Sie das Gerät vom Strom nehmen oder den Reset Knopf betätigen.
        <br /> <br />
        Wenn der Neustart nicht funktioniert hat, kontaktieren Sie den Support.
        <br /> <br />
      </p>

      <Link href={"/support/"}>
        <a>Support kontaktieren</a>
      </Link>
    </div>
  );

  return (
    <div className={css.wrap}>
      <PopoverWrap text={offlineInfo} disableAutoHidden>
        <div className={css.red}>
          <img src="/img/icons/red-status.svg" alt="status" />
          {count ? count : ""} Offline
        </div>
      </PopoverWrap>
    </div>
  );
};

export default OfflineBox;
