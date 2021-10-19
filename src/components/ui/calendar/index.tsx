import React, { FC } from "react";
import classNames from "classnames";
import moment from "moment";
import { useTranslations } from "next-intl";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { useMediaQuery } from "react-responsive";

import de from "date-fns/locale/de";
registerLocale("de", de);

import "react-datepicker/dist/react-datepicker.css";

const Calendar: FC<{ errors: any; field: any }> = ({ errors, field }) => {
  const t = useTranslations("report_fall");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? (
        <ReactDatePicker
          className={classNames("myDate")}
          wrapperClassName={classNames(errors.date && "error")}
          placeholderText="Datum auswählen"
          locale="de"
          selected={field.value}
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          onChange={(date) => field.onChange(date)}
        />
      ) : (
        <>
          {errors && field && (
            <div className={classNames("myCalendar", errors.date && "error")}>
              <div className="content">
                <p className={!field.value ? "placeholder" : ""}>
                  {field.value
                    ? moment(field.value).format("DD/MM/yyyy")
                    : t("date_plc")}
                </p>
                <img src="/img/icons/calendar.svg" alt="calendar" />
              </div>
              <input
                type="date"
                value={String(field.value)}
                max={moment().format("yyyy-MM-DD")}
                onChange={(date) => field.onChange(date)}
              />
            </div>
          )}{" "}
        </>
      )}
    </>
  );
};

export default Calendar;
