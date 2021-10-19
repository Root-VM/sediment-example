import React, { FC, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { TreatmentUnit } from "../../../interfaces/treatmentUnit";
import OfflineBox from "../../offlineBox";

import css from "./treatment-unit-card.module.scss";

const TreatmentUnitCard: FC<{ data: TreatmentUnit }> = ({ data }) => {
  const t = useTranslations("customers");
  const [deviceOfflineCount, setDeviceOfflineCount] = useState(0);
  const viewType = useSelector((state: RootState) => state.common.viewType);

  return (
    <Link href={"/treatment-units/" + data.id}>
      <a
        className={classNames(
          css.wrap,
          !data.is_send_alarm_notification_active && css.disable,
          viewType === "row" ? css.rowType : css.lineType
        )}
      >
        <p className={css.title}>{data.name}</p>

        <div className={css.line}>
          <div className={css.img}>
            <img src="/img/icons/location.svg" alt="location" />
          </div>
          <p>{t("location")}:</p>
          <span>{data.location}</span>
        </div>

        <div className={css.line}>
          <div className={css.img}>
            <img src="/img/icons/health.svg" alt="health" />
          </div>
          <p>{t("responsible")}:</p>
          <span>{data.caregivers_names.join(", ")}</span>
        </div>

        <div className={css.line}>
          <div className={css.img}>
            <img src="/img/icons/diamond.svg" alt="diamond" />
          </div>
          <p>{t("devices")}:</p>
          <span className={css.devices}>
            {data.number_of_devices}
            {deviceOfflineCount ? (
              <OfflineBox count={deviceOfflineCount} />
            ) : (
              ""
            )}
          </span>
        </div>

        {data.number_of_active_alarms ? (
          <div className={css.line}>
            <div className={css.img}>
              <img src="/img/icons/alarm.svg" alt="alarm" />
            </div>
            <p>{t("alarm")}:</p>
            <span className={css.alarm}>{data.number_of_active_alarms} </span>
          </div>
        ) : (
          <>{viewType !== "row" && <span className="desktopOnly">-</span>}</>
        )}
      </a>
    </Link>
  );
};

export default TreatmentUnitCard;
