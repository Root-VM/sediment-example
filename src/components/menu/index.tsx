import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

import css from "./menu.module.scss";

const list = [
  {
    img: "/img/menu/main.svg",
    href: "/customers",
    text: "Übersicht",
    activePages: ["/customers", "/treatment-units"],
  },
  {
    img: "/img/menu/fall.svg",
    href: "/report-fall",
    text: "Sturzereignis melden",
    activePages: ["/report-fall"],
  },
  {
    img: "/img/menu/support.svg",
    href: "/support",
    text: "Support",
    activePages: ["/support"],
  },
  {
    img: "/img/menu/user.svg",
    href: "/profile",
    text: "Profile",
    activePages: ["/profile"],
  },
];

const checkActiveRoute = (route: string, activePages: Array<string>) => {
  const val = "/" + route.split("/")[1].split("?")[0];
  return activePages.includes(val);
};

const Menu: FC = () => {
  const router = useRouter();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <div className={css.wrap}>
      {isDesktopOrLaptop ? (
        <Link href="/customers">
          <img src="/img/logo.svg" alt="logo" className={css.logo} />
        </Link>
      ) : (
        ""
      )}
      <menu>
        {list.map((item, i) => {
          return (
            <li
              key={i}
              className={
                checkActiveRoute(router.asPath, item.activePages)
                  ? css.active
                  : ""
              }
            >
              <Link href={item.href}>
                <a>
                  <img src={item.img} alt="menu" />
                  {isDesktopOrLaptop ? <p>{item.text}</p> : ""}
                </a>
              </Link>
            </li>
          );
        })}
      </menu>
    </div>
  );
};

export default Menu;
