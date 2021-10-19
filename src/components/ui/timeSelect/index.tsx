import React, { FC } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { useMediaQuery } from "react-responsive";

import de from "date-fns/locale/de";
registerLocale("de", de);

import "react-datepicker/dist/react-datepicker.css";
import css from "./time-select.module.scss";

const TimeSelect: FC<{ errors: any; field: any }> = ({ errors, field }) => {
  const t = useTranslations("report_fall");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? (
        <ReactDatePicker
          className={classNames("myDate")}
          wrapperClassName={classNames("clock", errors.time && "error")}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Zeit"
          dateFormat="h:mm aa"
          locale="de"
          placeholderText="Zeit auswählen"
          selected={field.value}
          onChange={(time) => field.onChange(time)}
        />
      ) : (
        <>
          {errors && field && (
            <div
              className={classNames("myTime", errors.time && "error", css.time)}
            >
              <div className="content">
                <p className={!field.value ? "placeholder" : ""}>
                  {field.value ? String(field.value) : t("time_plc")}
                </p>
                <img src="/img/icons/clock.svg" alt="clock" />
              </div>
              <input
                className={!field.value ? css.grey : ""}
                type="time"
                value={String(field.value)}
                onChange={(val) => field.onChange(val)}
              />
            </div>
          )}{" "}
        </>
      )}
    </>
  );
};

export default TimeSelect;
