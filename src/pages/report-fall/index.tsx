import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import moment from "moment";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AuthGuard } from "../../guards/authGuard";
import Menu from "../../components/menu";
import Check from "../../components/ui/check";
import Select, { components } from "react-select";
import Button from "../../components/ui/button";
import PageAnimation from "../../components/page-animations/pageAnimation";
import { RootDispatch } from "../../store";
import Calendar from "../../components/ui/calendar";
import TimeSelect from "../../components/ui/timeSelect";

import css from "./report-fall.module.scss";

const NoOptionsMessage = (props: any) => {
  const t = useTranslations("no_options");

  return (
    <components.NoOptionsMessage {...props}>
      <span>{t("")}</span>
    </components.NoOptionsMessage>
  );
};

const parseUnitsData = (data: Array<any>) => {
  if (data.length) {
    return data
      .map((val: any) => {
        return [
          ...new Set(
            val.map((val: any) => {
              return { label: val.name, value: val.id };
            })
          ),
        ];
      })
      .flat();
  }
  return [];
};

const ReportFallPage: FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const [messageSend, setMessageSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("report_fall");
  const [selectListData, setSelectListData] = useState<any>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
    shouldUseNativeValidation: false,
  });

  useEffect(() => {
    const initTreatmentData = async () => {
      const dataSelect = await dispatch.customers.getAllClientsLocationData();
      setSelectListData(parseUnitsData(dataSelect));
    };

    initTreatmentData();
  }, [dispatch.customers]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    const hour =
      data.time instanceof Date
        ? data.time.getHours()
        : data.time.split(":")[0];
    const minute =
      data.time instanceof Date
        ? data.time.getMinutes()
        : data.time.split(":")[1];
    const date = moment(data.date).set({ hour: hour, minute: minute }).format();

    await dispatch.customers.postMissedAlarm({
      reported_fall_time: date,
      description: data.text,
      treatment_unit: data.treatment.value,
    });

    setLoading(false);
    setMessageSend(true);
  };

  return (
    <AuthGuard>
      <div className={classNames("wrap", css.fallPage)}>
        <PageAnimation>
          {!messageSend ? (
            <>
              <h2 className="page-title">{t("title")}</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={css.box}>
                  <p className={css.title}>Datum des Sturzereignis</p>
                  <Controller
                    control={control}
                    name="date"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Calendar field={field} errors={errors} />
                    )}
                  />
                  {errors.date && <p className={css.errorText}>{t("error")}</p>}

                  <p className={css.title}>Ungefährer Zeitpunkt</p>
                  <Controller
                    control={control}
                    name="time"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TimeSelect field={field} errors={errors} />
                    )}
                  />
                  {errors.time && <p className={css.errorText}>{t("error")}</p>}

                  <p className={css.title}>Einheit</p>
                  <Controller
                    control={control}
                    name="treatment"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        className={classNames(
                          "mySelect",
                          css.select,
                          errors.treatment && "error"
                        )}
                        value={field.value}
                        options={selectListData}
                        placeholder={t("room")}
                        classNamePrefix="react-select"
                        instanceId="room"
                        components={{ NoOptionsMessage }}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                  {errors.treatment && (
                    <p className={css.errorText}>{t("error")}</p>
                  )}
                </div>

                <div className={css.box}>
                  <p className={classNames(css.title, css.titleMrg)}>
                    {t("description")}
                  </p>
                  <textarea
                    className={classNames(
                      "myTextarea",
                      css.textarea,
                      errors.text && "error"
                    )}
                    {...register("text", { required: true })}
                    placeholder={t("description_plc")}
                  />
                  {errors.text && (
                    <p className={classNames(css.errorText, css.errorTextarea)}>
                      {t("error")}
                    </p>
                  )}

                  <Controller
                    control={control}
                    name="check"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Check
                        name="check"
                        label={t("check_accept")}
                        isChecked={field.value}
                        handleChange={(val) => field.onChange(val)}
                        error={errors.check}
                      />
                    )}
                  />
                </div>

                <div className={css.btnGroup}>
                  <Button color="yellow" type="submit" disabled={loading}>
                    {t("save")}
                  </Button>
                  <Link href={"/customers/"}>
                    <a>
                      <Button color="default">{t("cancel")}</Button>
                    </a>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <Link href={"/customers/"}>
                <div className={css.back}>
                  <img src="/img/icons/back.svg" alt="back" />
                  Zurück
                </div>
              </Link>
              <p className={css.messageSend}>{t("form_sent")}</p>
            </>
          )}
        </PageAnimation>

        <Menu />
      </div>
    </AuthGuard>
  );
};

export function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      messages: require(`../../locales/${locale}/common.json`),
    },
  };
}
export default ReportFallPage;
