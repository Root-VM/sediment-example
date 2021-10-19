import React, { FC, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../store";

import css from "./view-type-select.module.scss";

const ViewTypeSelect: FC = () => {
  const type = useSelector((state: RootState) => state.common.viewType);
  const dispatch = useDispatch<RootDispatch>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  const selectType = useCallback(
    (type) => {
      dispatch.common.saveViewType(type);
    },
    [dispatch.common]
  );

  return (
    <>
      {isDesktopOrLaptop ? (
        <div className={css.wrap}>
          <img
            src="/img/icons/type-rows.svg"
            alt="type"
            onClick={() => selectType("row")}
            className={type === "row" ? css.active : ""}
          />
          <img
            src="/img/icons/type-lines.svg"
            alt="type"
            onClick={() => selectType("line")}
            className={type !== "row" ? css.active : ""}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewTypeSelect;
