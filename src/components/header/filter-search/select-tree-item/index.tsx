import React, { FC, useCallback, useEffect } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Check from "../../../ui/check";

import css from "./select-tree-item.module.scss";

const animation = {
  initial: {
    opacity: 0,
    height: "0px",
  },
  show: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3 },
  },
  hide: {
    opacity: 0,
    height: "0px",
    transition: { duration: 0.3 },
  },
};
const selectAll = (item: any) => {
  const statusList: Array<number> = [];
  for (const i in item.list) {
    const el: any = document.getElementById(item.title + i);
    statusList.push(Number(el?.checked));
  }

  for (const i in item.list) {
    const el: any = document.getElementById(item.title + i);
    setTimeout(() => {
      if (
        statusList.every((e) => e === 1) ||
        statusList.every((e) => e === 0)
      ) {
        el && el.click();
      } else {
        !el?.checked && el && el.click();
      }
    });
  }
};

const setTreeValue = (item: any, router: any) => {
  for (const i in item.list) {
    const el = document.getElementById(item.title + i);
    if (router.query[item.title] && router.query[item.title]?.length) {
      const query = router.query[item.title];
      const cond = query && query.includes(item.list[i]);
      if (el && cond) {
        setTimeout(() => el.click(), Number(i) * 30);
      }
    }
  }
};

const SelectTreeItem: FC<{ item: any }> = ({ item }) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const [selected, setSelected] = React.useState<any>([]);
  const [type, setType] = React.useState<"all" | "none" | "some">("none");
  const router = useRouter();
  const [firstLoaded, setFirstLoaded] = React.useState(false);

  useEffect(() => {
    !firstLoaded && setTreeValue(item, router);
    setFirstLoaded(true);
  }, [firstLoaded, item, router]);

  useEffect(() => {
    // save new tree value on select
    if (firstLoaded) {
      router.query[item.title] = selected;

      // emit page filter list
      router.replace(router);

      selected.length > 0 &&
        selected.length < item.list.length &&
        setType("some");
      selected.length === 0 && setType("none");
      selected.length === item.list.length && setType("all");

      setShowFilters(selected.length);
    }
    // need only selected detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const select = useCallback(
    (e: any, text: string) => {
      let values = [...new Set([...selected, text])];
      !e && (values = values.filter((v) => v !== text));
      setSelected(values);
    },
    [selected]
  );

  return (
    <div className={css.wrap}>
      <div className={css.titleLine}>
        <div onClick={() => selectAll(item)} className={css.allCheck}>
          {type === "all" && (
            <img src="/img/icons/check-active.svg" alt="check" />
          )}
          {type === "some" && (
            <img src="/img/icons/check-some.svg" alt="check" />
          )}
          {type === "none" && <img src="/img/icons/check.svg" alt="check" />}
        </div>
        <p onClick={() => setShowFilters(!showFilters)}>{item.title}</p>
        <img
          src="/img/icons/arrow.svg"
          alt="arrow"
          onClick={() => setShowFilters(!showFilters)}
          className={classNames(css.arrow, showFilters && css.rotate)}
        />
      </div>

      <AnimatePresence>
        <motion.div
          className={css.content}
          variants={animation}
          initial="initial"
          animate={showFilters ? "show" : "hide"}
          exit="hide"
        >
          {item.list.map((val: string, i: number) => {
            return (
              <Check
                label={val}
                name={item.title + i}
                key={i}
                handleChange={(e) => select(e, val)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SelectTreeItem;
