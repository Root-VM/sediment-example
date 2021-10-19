import React, { FC, useCallback, useState } from "react";
import Router from "next/router";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../store";
import { Profile } from "../../interfaces/profile";
import { AuthGuard } from "../../guards/authGuard";
import Menu from "../../components/menu";
import PageAnimation from "../../components/page-animations/pageAnimation";
import Modal from "../../components/modal";
import Button from "../../components/ui/button";

import css from "./profile.module.scss";

const ProfilePage: FC = () => {
  const profile: Profile = useSelector((state: RootState) => state.profile);
  const router = Router;
  const [logoutModal, setLogoutModal] = useState(false);
  const dispatch = useDispatch<RootDispatch>();
  const t = useTranslations("profile");

  const logout = useCallback(async () => {
    dispatch.profile.removeProfileAndToken();
    await router.push("/login");
  }, [dispatch.profile, router]);

  return (
    <AuthGuard>
      <div className={classNames("wrap", css.profilePage)}>
        <PageAnimation>
          <h2 className="page-title">{t("title")}</h2>

          <div className={css.box}>
            <div>
              <p className={css.title}>{t("full_name")}</p>
              <p className={css.text}>
                {profile.first_name} {profile.last_name}{" "}
              </p>
            </div>

            <div>
              <p className={css.title}>{t("email")}</p>
              <p className={css.text}>{profile.email}</p>
            </div>
          </div>

          <a
            href="https://www.sedimentum.com/datenschutzhinweise-safe-dienst-fuer-testbetrieb-schweiz/"
            target="_blank"
            rel="noreferrer"
            className={css.terms}
          >
            <Button color="yellow">Datenschutzerklärung</Button>
          </a>

          <button className={css.btn} onClick={() => setLogoutModal(true)}>
            <span>{t("logout")}</span>
            <img src="/img/icons/logout.svg" alt="logout" />
          </button>
        </PageAnimation>

        <Menu />

        <Modal isVisible={logoutModal} onClose={() => setLogoutModal(false)}>
          <div className={css.logout}>
            <h4>{t("logout_you_sure")}</h4>

            <div className={css.btnGroup}>
              <Button color="yellow" onClick={logout}>
                {t("logout")}
              </Button>
              <Button color="default" onClick={() => setLogoutModal(false)}>
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
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

export default ProfilePage;
