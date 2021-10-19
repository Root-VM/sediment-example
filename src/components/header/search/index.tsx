import React, { ChangeEvent, FC, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import ViewTypeSelect from "../../viewTypeSelect";

import css from "./search.module.scss";

const Search: FC = () => {
  const router = useRouter();
  const inp = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  const onFocus = useCallback(() => {
    document.getElementsByTagName("body")[0].classList.add("disableScroll");
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    document.getElementsByTagName("body")[0].classList.remove("disableScroll");
    setFocused(false);
  }, []);

  const onInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      const setQuery = () => {
        router.replace(text ? `/customers?searchValue=${text}` : "/customers");
      };

      setQuery();
      setTimeout(() => setQuery(), 30);
    },
    [router]
  );

  return (
    <div className={css.wrap}>
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
      </div>

      {isDesktopOrLaptop ? <ViewTypeSelect /> : ""}
    </div>
  );
};

export default Search;
