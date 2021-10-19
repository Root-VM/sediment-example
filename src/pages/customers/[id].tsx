import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { AuthGuard } from "../../guards/authGuard";
import { useRouter } from "next/router";
import Menu from "../../components/menu";
import FilterSearch from "../../components/header/filter-search";
import Filter from "./filter";
import TreatmentUnitCard from "../../components/cards/treatmentUnitCard";
import PageAnimation from "../../components/page-animations/pageAnimation";
import { RootDispatch, RootState } from "../../store";
import { TreatmentUnit } from "../../interfaces/treatmentUnit";

import css from "./customers-list.module.scss";

const filterMethod = (data: TreatmentUnit, filter: filterType) => {
  let textSearchMatches =
    data.name.toUpperCase().indexOf(filter.name.toUpperCase()) > -1 ||
    data.caregivers_names[0].toUpperCase().indexOf(filter.name.toUpperCase()) >
      -1;
  let haveSameType = true;
  let hasInDetail = false;

  switch (filter.type) {
    case "deactivated":
      haveSameType = !data.is_send_alarm_notification_active;
      break;
    case "alarms":
      haveSameType = !!data.number_of_active_alarms;
      break;
  }

  if (filter.details.length) {
    for (const item of filter.details) {
      if (data.location === item.title) {
        hasInDetail = !!item.text.filter(
          (val: string) => val === data.caregivers_names[0]
        ).length;
      }
    }
  } else {
    hasInDetail = true;
  }

  return textSearchMatches && haveSameType && hasInDetail;
};

const getDetailsFilter = (route: any) => {
  const result = [];
  for (let item of Object.keys(route)) {
    if (
      item !== "id" &&
      item !== "name" &&
      item !== "type" &&
      item !== "undefined"
    ) {
      const val: any = { title: item, text: [] };
      typeof route[item] === "string"
        ? (val.text = [route[item]])
        : (val.text = route[item]);
      val.text.length && result.push(val);
    }
  }
  return result;
};

interface filterType {
  name: string;
  type: string;
  details: Array<any>;
}
const CustomersListPage: FC = () => {
  const [filter, setFilter] = useState<filterType>({
    name: "",
    type: "all",
    details: [],
  });
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);
  const dispatch = useDispatch<RootDispatch>();
  const router = useRouter();
  const treatmentUnits: Array<TreatmentUnit> = useSelector(
    (state: RootState) => state.customers.treatmentUnits
  );
  const savedFilters: Array<{ id: string; value: string }> = useSelector(
    (state: RootState) => state.common.treatmentUnitsFilter
  );
  const viewType = useSelector((state: RootState) => state.common.viewType);
  const t = useTranslations("customers");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  useEffect(() => {
    const id = router.query.id;
    if (id && typeof id === "string") {
      dispatch.customers.getTreatmentUnits(id);

      const filter = savedFilters.find((val) => val.id === id);

      // set saved filters route for this unit
      if (filter) {
        if (!filter.value.includes("type=")) {
          filter.value = filter.value ? filter.value + "&type=all" : "type=all";
        }
        router.replace(router.asPath.split("?")[0] + "?" + filter.value);
      }
    }
    // need only on first loading detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      // filtering
      const data: any = { name: "", type: "", details: [] };
      const filterDetail = getDetailsFilter(router.query);
      router.query?.name && (data.name = String(router.query.name));
      router.query?.type && (data.type = String(router.query.type));
      filterDetail && (data.details = filterDetail);

      // filter counting
      if (filterDetail?.length) {
        const count = filterDetail.map((val) => val.text).length;
        setActiveFilterCount(count);
      } else {
        setActiveFilterCount(0);
      }

      setFilter({ ...filter, ...data });

      const cond =
        (url.includes("customers/") && url.length > 30) ||
        (url.includes("treatment-units/") && url.length > 30);

      // save filter route on treatment-units page and remove on else
      if (cond) {
        dispatch.common.saveFilters({
          id: String(router.query.id),
          value: router.asPath.split("?")[1],
        });
      } else {
        dispatch.common.saveFilters({
          id: String(router.query.id),
          value: "type=all",
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // dont need use filter detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const clearFilterDetail = useCallback(() => {
    let queries = filter.name ? "name=" + filter.name + "?" : "";
    queries = filter.type ? queries + "type=" + filter.type : "";

    router.replace(router.asPath.split("?")[0] + "?" + queries);

    // next js routeChangeComplete event emit new value
    setTimeout(() => {
      router.replace(router.asPath.split("?")[0] + "?" + queries);
    }, 300);
  }, [filter.name, filter.type, router]);

  return (
    <AuthGuard>
      <div
        className={classNames(
          "wrap",
          css.customersPage,
          viewType === "row" ? css.rowType : css.lineType
        )}
      >
        <PageAnimation>
          <div className={css.controls}>
            <FilterSearch data={treatmentUnits} id={String(router.query.id)}>
              <div
                className={classNames(
                  css.filterImg,
                  filter.details.length && css.point
                )}
              >
                <img src="/img/icons/filter.svg" alt="filter" />
              </div>
            </FilterSearch>

            <div className={css.filterRow}>
              {treatmentUnits.length ? <Filter data={treatmentUnits} /> : ""}

              {activeFilterCount ? (
                <p className={css.greyText}>
                  <img src="/img/icons/info-grey.svg" alt="info" />
                  {activeFilterCount} {t("filter_active")}
                  <span onClick={clearFilterDetail}>(Filter zurücksetzen)</span>
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className={css.list}>
            {isDesktopOrLaptop && (
              <div className={css.listTitle}>
                <p>Treatment Unit</p>
                <p>
                  <img src="/img/icons/location.svg" alt="location" />
                  Standort
                </p>
                <p>
                  <img src="/img/icons/health.svg" alt="health" />
                  Betreut durch:
                </p>
                <p>
                  <img src="/img/icons/diamond.svg" alt="diamond" />
                  Geräte
                </p>
                <p>
                  <img src="/img/icons/alarm.svg" alt="alarm" />
                  Benachrichtigungen
                </p>
              </div>
            )}
            {treatmentUnits
              .filter((data) => filterMethod(data, filter))
              .map((item, i) => {
                return <TreatmentUnitCard data={item} key={i} />;
              })}
          </div>
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

export default CustomersListPage;
