import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { AuthGuard } from "../../guards/authGuard";
import Logo from "../../components/header/logo";
import Menu from "../../components/menu";
import TreatmentUnitGroupCard from "../../components/cards/treatmentUnitGroupCard";
import PageAnimation from "../../components/page-animations/pageAnimation";
import { RootDispatch, RootState } from "../../store";
import { Customer } from "../../interfaces/customer";
import Search from "../../components/header/search";

import css from "./customers.module.scss";

const filterMethod = (item: any, filterText: string) => {
  if (filterText) {
    return item.name.toUpperCase().indexOf(filterText.toUpperCase()) > -1;
  }

  return true;
};

const CustomersPage: FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const customers: Array<Customer> = useSelector(
    (state: RootState) => state.customers.list
  );
  const [disableAnimation, setDisableAnimation] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const router = useRouter();
  const t = useTranslations("customers");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });
  const viewType = useSelector((state: RootState) => state.common.viewType);

  useEffect(() => {
    const handleRouteChange = () => {
      const text = router.query?.searchValue;

      setFilterText(text ? String(text) : "");
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    if (customers && customers?.length) {
      if (customers.length === 1) {
        dispatch.common.hideBackIconOnTreatmentList(true);
        setDisableAnimation(true);

        setTimeout(() => {
          router.replace("/customers/" + customers[0].id + "?type=all");
        });
      } else {
        setLoading(false);
        dispatch.common.hideBackIconOnTreatmentList(false);
      }
    } else {
      setLoading(false);
      dispatch.common.hideBackIconOnTreatmentList(false);
    }
    // need only customers detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);

  useEffect(() => {
    setLoading(true);
    dispatch.customers.getCustomers();

    // remove treatments units from store
    dispatch.customers.removeTreatmentUnits();
  }, [dispatch.customers]);

  const clearFilter = useCallback(() => {
    router.replace("/customers");
    setShowSearch(false);

    // next js routeChangeComplete event, emit new value (detect fix)
    setTimeout(() => {
      router.replace("/customers");
      setShowSearch(true);
    }, 30);
  }, [router]);

  return (
    <AuthGuard>
      <div
        className={classNames(
          "wrap",
          css.clientsPage,
          viewType === "row" ? css.rowType : css.lineType
        )}
      >
        <PageAnimation disableAnimation={disableAnimation}>
          <Logo showInDesktop={false} />

          {!loading && (
            <>
              <div className={css.box}>
                <h2 className="page-title">{t("customer_overview")}</h2>
                {showSearch && <Search />}
              </div>

              {filterText && !isDesktopOrLaptop && (
                <p className={css.greyText}>
                  <span>
                    <img src="/img/icons/info-grey.svg" alt="info" />
                    {'"'}
                    {filterText}
                    {'"'} {t("filter_active")}
                  </span>
                  <span onClick={clearFilter}>(Filter zurücksetzen)</span>
                </p>
              )}

              <div className={css.list}>
                {isDesktopOrLaptop && (
                  <div className={css.listTitle}>
                    <p>Kunde</p>
                    <p>
                      <img src="/img/icons/location.svg" alt="location" />
                      Standort
                    </p>
                    <p>
                      <img src="/img/icons/door-black.svg" alt="door" />
                      Einheiten
                    </p>
                    <p>
                      <img src="/img/icons/alarm.svg" alt="alarm" />
                      Benachrichtigungen
                    </p>
                  </div>
                )}
                {customers.length
                  ? customers
                      .filter((data) => filterMethod(data, filterText))
                      .map((data, i) => {
                        return (
                          <TreatmentUnitGroupCard customer={data} key={i} />
                        );
                      })
                  : ""}
              </div>
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

export default CustomersPage;
