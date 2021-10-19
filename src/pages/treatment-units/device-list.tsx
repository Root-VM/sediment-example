import React, { FC } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { RootState } from "../../store";
import OfflineBox from "../../components/offlineBox";

import css from "./treatment-units.module.scss";

const DeviceList: FC<{ devices: any[] }> = ({ devices }) => {
  const t = useTranslations("treatment_units");
  const viewType = useSelector((state: RootState) => state.common.viewType);

  return (
    <>
      {devices.length ? (
        <div
          className={classNames(
            css.locationList,
            viewType === "row" ? css.rowType : css.lineType
          )}
        >
          {devices.map((item, i) => {
            return (
              <div key={i}>
                <div className={css.status}>
                  <p>{item.description}</p>

                  {item.activity_intensity_graph_enabled ? (
                    <span>
                      <img src="/img/icons/green-status.svg" alt="status" />
                      {t("online")}
                    </span>
                  ) : (
                    <OfflineBox />
                  )}
                </div>

                {i < item.length - 1 && <hr />}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DeviceList;
