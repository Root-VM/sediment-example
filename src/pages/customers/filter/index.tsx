import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { TreatmentUnit } from "../../../interfaces/treatmentUnit";

import css from "./filter.module.scss";

const Filter: FC<{ data: Array<TreatmentUnit> }> = ({ data }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [firstLoaded, setFirstLoaded] = React.useState(false);
  const t = useTranslations("filter");
  const [list, setList] = useState([
    { text: "all", label: t("all"), count: 0, imgUrl: "", active: true },
    {
      text: "alarms",
      label: t("alarm"),
      count: 0,
      imgUrl: "/img/icons/alarm.svg",
      active: false,
    },
    {
      text: "deactivated",
      label: t("deactivate"),
      count: 0,
      imgUrl: "/img/icons/door-black.svg",
      active: false,
    },
    // {
    //   text: "offline",
    //   label: "Geräte Offline",
    //   count: 0,
    //   imgUrl: "/img/icons/black-status.svg",
    //   active: false,
    // },
  ]);

  const rewriteView = () => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    });
  };

  useEffect(() => {
    // set saved filter on first loading
    if (router.query?.id && router.query?.type && !firstLoaded) {
      setFirstLoaded(true);
      const data = list.map((item) => {
        item.active = router.query.type === item.text;
        return item;
      });
      setList(data);
      rewriteView();
      router.replace(router);
    }
    // need only on first loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, router.query.type]);

  useEffect(() => {
    // generating filter count from list
    const rewriteList = list;
    rewriteList[0].count = data.length;
    rewriteList[1].count = data.filter(
      (val) => val.number_of_active_alarms
    ).length;
    rewriteList[2].count = data.filter(
      (val) => !val.is_send_alarm_notification_active
    ).length;

    setList(rewriteList);
    rewriteView();
    // dont need list detect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const select = (key: number, item: any) => {
    const rewriteList = list.map((val, i) => {
      val.active = key === i;
      return val;
    });
    router.query.type = item.text;
    router.replace(router);

    setList(rewriteList);
  };

  return (
    <div className={css.filter}>
      {list.map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => {
              select(i, item);
            }}
            className={classNames(css.item, item.active && css.active)}
          >
            {item.imgUrl && <img src={item.imgUrl} alt="filterIcon" />}
            <p>{item.label}</p>
            <span>({item.count})</span>
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
