import React, { FC } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { AuthGuard } from "../../guards/authGuard";
import PageAnimation from "../../components/page-animations/pageAnimation";
import Menu from "../../components/menu";
import ContactsData from "../../components/contactsSupport/contactsData";
import Button from "../../components/ui/button";

import css from "./support.module.scss";

const SupportPage: FC = () => {
  const t = useTranslations("support");

  return (
    <AuthGuard>
      <div className={classNames("wrap", css.contactsPage)}>
        <PageAnimation>
          <h2 className="page-title">{t("contacts_support")}</h2>
          <p>
            {t("have_question1")} {t("have_question2")}
          </p>

          <div className={css.list}>
            <ContactsData inputsStyle />

            <a
              href="https://www.sedimentum.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Button color="default">
                <img src="/img/icons/manual.svg" alt="manual" />
                Anleitung
              </Button>
            </a>
          </div>
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

export default SupportPage;
