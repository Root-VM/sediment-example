import React, { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import css from "./page-animation.module.scss";

const variants = {
  initial: {
    opacity: 0,
    marginLeft: "0%",
  },
  show: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  slide: {
    width: "calc(100vw - 60px)",
    marginLeft: "-110%",
    transition: { duration: 0.3 },
  },
  back: {
    width: "calc(100vw - 60px)",
    marginLeft: "110%",
    transition: { duration: 0.3 },
  },
};

const PageAnimation: FC<{ disableAnimation?: boolean }> = ({
  disableAnimation,
  children,
}) => {
  const router = useRouter();
  const [exit, setExit] = useState<"initial" | "exit" | "back" | "slide">(
    "exit"
  );

  useEffect(() => {
    const handleRouteChange = (data: any) => {
      if (disableAnimation) {
        return null;
      }

      let path =
        data.split("/")[1] === "customers" && data.length > 40
          ? "customers-list"
          : data.split("/")[1];
      // if we use language in router path
      // path = (path === 'de' || path === 'en') ?( (data.split('/')[2] === 'customers' && data.length > 40)
      //   ? 'customers-list' : data.split('/')[2] ): path;

      if (router.pathname == "/customers") {
        path === "customers-list" && setExit("slide");
      }
      if (router.pathname == "/customers/[id]") {
        setExit(path === "customers" ? "back" : "slide");
      }
      if (router.pathname == "/treatment-units/[id]") {
        setExit(path === "customers-list" ? "back" : "slide");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, router.pathname, disableAnimation]);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="show"
      exit={exit}
      className={css.el}
    >
      {children}
    </motion.div>
  );
};

export default PageAnimation;
