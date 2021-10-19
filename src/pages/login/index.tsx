import React, { FC, useState } from "react";
import Router from "next/router";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import PageAnimation from "../../components/page-animations/pageAnimation";
import { RootDispatch } from "../../store";
import Logo from "../../components/header/logo";
import Input from "../../components/ui/input";
import Check from "../../components/ui/check";
import Button from "../../components/ui/button";
import ContactsSupport from "../../components/contactsSupport";

import css from "./login.module.scss";

// const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;

const LoginPage: FC = () => {
  const router = Router;
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<RootDispatch>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
    shouldUseNativeValidation: false,
  });
  const t = useTranslations("login");

  const onSubmit = async (data: any) => {
    setLoading(true);
    const request = await dispatch.profile.getProfileAndToken({
      name: data.name,
      password: data.password,
      stayLogin: data.stayLogin,
    });

    if (request && request?.error && request?.error?.non_field_errors) {
      setApiError(request.error.non_field_errors[0]);
      setLoading(false);
      return;
    }

    setApiError("");
    await router.push("/customers");
    setLoading(false);
  };

  return (
    <div className={classNames("wrap", css.loginPage)}>
      <Logo showInDesktop />

      <PageAnimation>
        <h1 className="page-title">{t("title")}</h1>

        {apiError && <p className={css.errorTitle}>{apiError}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="input-title">{t("user_name")}</p>
          <Input
            placeholder="Benutzername"
            type="text"
            error={errors.name}
            register={register("name", { required: true })}
          />
          {errors.name && (
            <p className={css.errorText}>{t("user_name_error")}</p>
          )}

          <p className="input-title">{t("password")}</p>
          <Input
            placeholder="Passwort"
            type="password"
            error={errors.password}
            register={register("password", {
              required: true,
            })}
          />
          {errors.password && (
            <p className={css.errorText}>{t("password_error")}</p>
          )}

          <Controller
            control={control}
            name="stayLogin"
            render={({ field }) => (
              <Check
                name="check"
                label={t("stay_signed_in")}
                isChecked={field.value}
                handleChange={(val) => field.onChange(val)}
              />
            )}
          />

          <Controller
            control={control}
            name="terms"
            rules={{ required: true }}
            render={({ field }) => (
              <Check
                name="terms"
                error={errors.terms}
                label={
                  <p className={css.terms}>
                    Ich habe die{" "}
                    <a
                      href="https://www.sedimentum.com/datenschutzhinweise-safe-dienst-fuer-testbetrieb-schweiz/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Datenschutzerklärung
                    </a>{" "}
                    gelesen und stimme dieser zu.
                  </p>
                }
                isChecked={field.value}
                handleChange={(val) => field.onChange(val)}
              />
            )}
          />

          <Button
            disabled={errors.name || errors.password || loading}
            color="yellow"
            type="submit"
          >
            {t("title")}
          </Button>
        </form>

        <ContactsSupport />
      </PageAnimation>
    </div>
  );
};

export function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      messages: require(`../../locales/${locale}/common.json`),
    },
  };
}

export default LoginPage;
