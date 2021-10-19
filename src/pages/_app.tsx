import Head from "next/head";
import type { AppProps } from "next/app";
import { NextIntlProvider } from "next-intl";
import Router from "next/router";
import Script from "next/script";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { PersistGate } from "redux-persist/integration/react";
import { getPersistor } from "@rematch/persist";
import store from "../store";
import SettingsProvider from "../components/setting-provider";

import "normalize.css";
import "../styles/index.scss";

// page-animation fix timeout transition before exit complete
const routeChange = () => {
  const tempFix = () => {
    const allStyleElems = document.querySelectorAll('style[media="x"]');
    allStyleElems.forEach((elem) => {
      elem.removeAttribute("media");
    });
  };
  tempFix();
};

Router.events.on("routeChangeComplete", routeChange);
Router.events.on("routeChangeStart", routeChange);

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <>
      <Script src="/__ENV.js" strategy="beforeInteractive" />
      <NextIntlProvider messages={pageProps.messages} onError={() => {}}>
        <Provider store={store}>
          <PersistGate persistor={getPersistor()}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"
              />
              <link rel="shortcut icon" href="/img/logo-small.svg" />
              <title>Vigilance Cockpit</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
              />
            </Head>
            <SettingsProvider>
              <AnimatePresence exitBeforeEnter>
                <Component {...pageProps} key={router.route} />
              </AnimatePresence>
            </SettingsProvider>
          </PersistGate>
        </Provider>
      </NextIntlProvider>
    </>
  );
};

// noinspection JSUnusedGlobalSymbols
export default MyApp;
