import React, { FC, useCallback, useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import Modal from "../../components/modal";
import Button from "../../components/ui/button";
import { RootDispatch, RootState } from "../../store";
import { TreatmentUnitDetail } from "../../interfaces/treatmentUnitDetail";

import css from "./treatment-units.module.scss";

const getDeviceName = (item: any, devices: any[]) => {
  const result = devices.find((val) => val.id === item.device_id);
  return result ? result.description : "";
};

const sortByDate = (a: any, b: any) => {
  return new Date(b).getTime() - new Date(a).getTime();
};

const AlarmList: FC<{ data: TreatmentUnitDetail; id: string }> = ({
  data,
  id,
}) => {
  const [notClear, setNotClearModal] = useState("");
  const [messageSend, setMessageSend] = useState("");
  const t = useTranslations("treatment_units");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
    shouldUseNativeValidation: false,
  });
  const dispatch = useDispatch<RootDispatch>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });
  const viewType = useSelector((state: RootState) => state.common.viewType);

  const sendUnclear = useCallback(
    async (val: any, date: string, alarmId: string) => {
      setLoading(true);

      await dispatch.customers.postMissedAlarm({
        reported_fall_time: date,
        description: val.text,
        treatment_unit: id,
      });

      setValue("text", "");
      setMessageSend(alarmId);
      setLoading(false);
    },
    [dispatch.customers, id, setValue]
  );

  return (
    <div
      className={classNames(
        css.alarmList,
        viewType === "row" ? css.rowType : css.lineType
      )}
    >
      {data &&
        data.active_alarms &&
        data.active_alarms
          .sort((a, b) => sortByDate(a.timestamp, b.timestamp))
          .map((item, i) => {
            return (
              <div key={i}>
                <div className={css.item}>
                  {isDesktopOrLaptop ? <p>Sturzähnliches Ereignis</p> : ""}

                  <p>{moment(item.timestamp).format("DD/MM/YYYY hh:mm")}</p>
                  <p>
                    {!isDesktopOrLaptop ? <span>{t("devices")}: </span> : ""}
                    {getDeviceName(item, data.devices)}
                  </p>

                  <div className={css.btnGroup}>
                    <div
                      className={classNames(css.active, "reportBtn")}
                      onClick={() => setNotClearModal(item.id)}
                    >
                      {t("fall_report")}
                    </div>
                  </div>

                  {i < data.active_alarms.length - 1 && <hr />}
                </div>

                <Modal
                  isVisible={item.id === notClear}
                  onClose={() => setNotClearModal("")}
                >
                  <form
                    className={css.notClear}
                    onSubmit={handleSubmit((e: any) =>
                      sendUnclear(e, item.timestamp, item.id)
                    )}
                  >
                    <h4>
                      {messageSend === item.id
                        ? "Die Meldung des Sturzereignis wurde erfolgreich übermittelt."
                        : t("description")}
                    </h4>

                    <AnimatePresence exitBeforeEnter>
                      {messageSend !== item.id && (
                        <>
                          <textarea
                            className={classNames(
                              "myTextarea",
                              css.textarea,
                              errors.text && "error"
                            )}
                            placeholder={t("describe")}
                            {...register("text", { required: true })}
                          />
                          {errors.text && (
                            <p className={css.errorText}>
                              {t("describe_error")}
                            </p>
                          )}

                          <Button
                            color="yellow"
                            type="submit"
                            disabled={errors.text || loading}
                          >
                            {t("send")}
                          </Button>
                        </>
                      )}
                    </AnimatePresence>
                  </form>
                </Modal>
              </div>
            );
          })}
    </div>
  );
};

export default AlarmList;
