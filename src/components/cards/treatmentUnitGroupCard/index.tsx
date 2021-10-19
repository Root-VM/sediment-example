import React, { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../../store";
import { Customer } from "../../../interfaces/customer";
import PopoverWrap from "../../popoverWrap";

import css from "./treatment-unit-group-card.module.scss";

const TreatmentUnitGroupCard: FC<{ customer: Customer }> = ({ customer }) => {
  const t = useTranslations("customers");
  const viewType = useSelector((state: RootState) => state.common.viewType);

  return (
    <div
      className={classNames(
        css.wrap,
        viewType === "row" ? css.rowType : css.lineType
      )}
    >
      <Link href={"/customers/" + customer.id}>
        <a className={css.pageLink} />
      </Link>
      <p className={css.title}>{customer.name}</p>

      <div className={css.line}>
        <div className={css.img}>
          <img src="/img/icons/location.svg" alt="location" />
        </div>
        <p>{t("location")}:</p>
        <span>{customer.number_of_locations}</span>
      </div>

      <div className={css.line}>
        <div className={css.img}>
          <img src="/img/icons/door.svg" alt="door" />
        </div>
        <p>{t("count")}:</p>
        <span>{customer.number_of_treatment_units}</span>
        {customer.number_of_treatment_units ? (
          <PopoverWrap text={t("deactivate")}>
            <div className={css.doorAlarm}>
              <img src="/img/icons/door-grey.svg" alt="door" />
              <p>{customer.number_of_deactivated_treatment_units}</p>
            </div>
          </PopoverWrap>
        ) : (
          ""
        )}
      </div>

      <div className={css.line}>
        <div className={css.img}>
          <img src="/img/icons/alarm.svg" alt="alarm" />
        </div>
        <p>{t("notifications")}:</p>
        {customer.number_of_active_alarms ? (
          <PopoverWrap text={t("last_72")}>
            <div className={css.alarm}>
              {customer.number_of_active_alarms}
              <img src="/img/icons/i-grey.svg" alt="door" />
            </div>
          </PopoverWrap>
        ) : (
          <span>-</span>
        )}
      </div>
    </div>
  );
};

export default TreatmentUnitGroupCard;
