import React, { FC, useCallback, useEffect } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { AuthGuard } from "../../guards/authGuard";
import Menu from "../../components/menu";
import Setting from "../../components/header/setting";
import PageAnimation from "../../components/page-animations/pageAnimation";
import { RootDispatch, RootState } from "../../store";
import { TreatmentUnitDetail } from "../../interfaces/treatmentUnitDetail";
import AlarmList from "./alarm-list";
import DeviceList from "./device-list";

import css from "./treatment-units.module.scss";

const TreatmentUnitsPage: FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const router = useRouter();
  const treatmentUnit: TreatmentUnitDetail = useSelector(
    (state: RootState) => state.customers.treatmentUnitDetail
  );
  const t = useTranslations("treatment_units");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });
  const viewType = useSelector((state: RootState) => state.common.viewType);

  const init = useCallback(() => {
    if (router.query.id) {
      dispatch.customers.getTreatmentUnit(String(router.query.id));
    }
    // need only on first loading detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <AuthGuard>
      <div
        className={classNames(
          "wrap",
          css.detailPage,
          !treatmentUnit.is_send_alarm_notification_active && css.disable,
          viewType === "row" ? css.rowType : css.lineType
        )}
      >
        <PageAnimation>
          {router.query.id && treatmentUnit ? (
            <Setting
              id={String(router.query.id)}
              onSubmit={init}
              value={treatmentUnit.is_send_alarm_notification_active}
            />
          ) : (
            ""
          )}

          <div className={css.rootTexts}>
            <p className={css.text}>{treatmentUnit.location}</p>
            <h4>{treatmentUnit.name}</h4>
          </div>

          {treatmentUnit.active_alarms && treatmentUnit.active_alarms.length ? (
            <>
              <div className={css.titleGroup}>
                <p className={css.title}>
                  <span>{t("last_72_notf")}</span>
                  {treatmentUnit.number_of_active_alarms ? (
                    <span>{treatmentUnit.number_of_active_alarms}</span>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <div className={css.list}>
                {isDesktopOrLaptop && (
                  <div className={css.listTitle}>
                    <p>
                      <img src="/img/icons/clock-black.svg" alt="clock" />
                      Ereignis
                    </p>
                    <p>Zeitpunkt</p>
                    <p>
                      <img src="/img/icons/diamond.svg" alt="diamond" />
                      Gerät
                    </p>
                    <p>Aktionen</p>
                  </div>
                )}
                <AlarmList data={treatmentUnit} id={String(router.query.id)} />
              </div>
            </>
          ) : (
            ""
          )}

          {treatmentUnit.devices && (
            <>
              <p className={css.title}>{t("devices")}</p>

              <DeviceList devices={treatmentUnit.devices} />
            </>
          )}
        </PageAnimation>
        <Menu />
      </div>
    </AuthGuard>
  );
};

export function getServerSideProps({ locale }: { locale: any }) {
  return {
    props: {
      messages: require(`../../locales/${locale}/common.json`),
    },
  };
}
export default TreatmentUnitsPage;
