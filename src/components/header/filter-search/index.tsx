import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import SelectTreeItem from "./select-tree-item";
import Modal from "../../modal";
import { TreatmentUnit } from "../../../interfaces/treatmentUnit";
import ViewTypeSelect from "../../viewTypeSelect";

import css from "./filter-search.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const resetFilter = (filterList: any) => {
  for (const item of filterList) {
    for (const i in item.list) {
      const el: any = document.getElementById(item.title + i);
      if (el && el.checked) {
        setTimeout(() => {
          el.click();
        }, Number(i) * 30);
      }
    }
  }
};

const FilterSearch: FC<{ data: Array<TreatmentUnit>; id: string }> = ({
  data,
  id,
  children,
}) => {
  const router = useRouter();
  const t = useTranslations("filter");
  const inp = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [customerTitle, setCustomerTitle] = React.useState("");
  const [firstLoaded, setFirstLoaded] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterList, setFilterList] = useState<any>([]);
  const customersList: Array<any> = useSelector(
    (state: RootState) => state.customers.list
  );
  const hideBackButton: boolean = useSelector(
    (state: RootState) => state.common.hideBackIconOnTreatmentList
  );

  useEffect(() => {
    // set saved filter on first loading
    if (router.query?.id && router.query?.name && !firstLoaded) {
      setFirstLoaded(true);
      inp.current && (inp.current.value = String(router.query.name));
      router.replace(router);
    }
    // need only on loaded if we have query.name
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, router.query.name]);

  const dataParse = useCallback(() => {
    if (data.length) {
      const list = [...new Set(data.map((val) => val.location))].map((val) => {
        let result = { title: val, list: [""] };

        result.list = data
          .filter((el) => el.location === val)
          .map((el) => el.caregivers_names[0]);
        result.list = [...new Set(result.list)];

        return result;
      });
      setFilterList(list);
    }
  }, [data]);

  const setCustomerName = useCallback(() => {
    if (customersList?.length) {
      const data = customersList.find((val) => val.id === id);

      if (data && data?.name) {
        setCustomerTitle(data.name);
      }
    }
  }, [customersList, id]);

  useEffect(() => {
    dataParse();
  }, [dataParse]);

  useEffect(() => {
    setCustomerName();
  }, [setCustomerName]);

  const onFocus = useCallback(() => {
    document.getElementsByTagName("body")[0].classList.add("disableScroll");
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    document.getElementsByTagName("body")[0].classList.remove("disableScroll");
    setFocused(false);
  }, []);
  const removeFilter = useCallback(() => {
    document.getElementsByTagName("body")[0].classList.remove("disableScroll");
    setFocused(false);
    delete router.query.name;
    router.replace(router);
    inp.current && (inp.current.value = "");
  }, [router]);
  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      router.query.name = e.target.value;
      router.replace(router);
    },
    [router]
  );

  return (
    <div className={css.wrap}>
      {!hideBackButton ? (
        <div className={css.back} onClick={() => router.push("/customers")}>
          <img src="/img/icons/back.svg" alt="back" />
          {!inp?.current?.value && !focused ? (
            <p className={css.title}>{customerTitle}</p>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className={css.back}>
          {!inp?.current?.value && !focused ? (
            <p style={{ marginLeft: 0 }} className={css.title}>
              {customerTitle}
            </p>
          ) : (
            ""
          )}
        </div>
      )}

      <ViewTypeSelect />

      <div className={classNames(css.search, focused && css.active)}>
        <input
          type="text"
          ref={inp}
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <img
          src="/img/icons/search.svg"
          alt="search"
          onClick={() => inp.current && inp.current.focus()}
        />

        {/*<AnimatePresence exitBeforeEnter>*/}
        {/*  {focused && (*/}
        {/*    <motion.div*/}
        {/*      className={css.greyBg}*/}
        {/*      initial={{ opacity: 0 }}*/}
        {/*      animate={{ opacity: 1 }}*/}
        {/*      exit={{ opacity: 0 }}*/}
        {/*      transition={{ duration: 0.3 }}*/}
        {/*    >*/}
        {/*      <img*/}
        {/*        className={css.whiteImg}*/}
        {/*        src="/img/icons/close-white.svg"*/}
        {/*        alt="close"*/}
        {/*        onClick={removeFilter}*/}
        {/*      />*/}
        {/*    </motion.div>*/}
        {/*  )}*/}
        {/*</AnimatePresence>*/}
      </div>

      <div className={css.filterIcon} onClick={() => setShowModal(true)}>
        {children}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className={css.filter}>
          <div className={css.titleGroup}>
            <h4>{t("title")}</h4>

            <div className={css.reset} onClick={() => resetFilter(filterList)}>
              <img src="/img/icons/reset.svg" alt="reset" />
              {t("reset")}
            </div>
          </div>
          <p>{t("location")}:</p>

          {filterList.map((item: any, i: number) => {
            return <SelectTreeItem item={item} key={i} />;
          })}
        </form>
      </Modal>
    </div>
  );
};

export default FilterSearch;
