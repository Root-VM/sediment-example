import React, { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import Button from "../../ui/button";
import Modal from "../../modal";
import Switch from "../../ui/switch";
import { RootDispatch } from "../../../store";

import css from "./setting.module.scss";
import { useMediaQuery } from "react-responsive";
import ViewTypeSelect from "../../viewTypeSelect";

interface PropsInterface {
  id: string;
  value: boolean;
  onSubmit: () => void;
}

const Setting: FC<PropsInterface> = ({ id, value, onSubmit }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch<RootDispatch>();
  const t = useTranslations("treatment_units");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const submit = useCallback(async () => {
    setLoading(true);

    await dispatch.customers.switchTreatmentUnit({ id, value: checked });

    setLoading(false);
    setChecked(checked);
    setShowModal(false);
    onSubmit && onSubmit();
  }, [checked, dispatch.customers, id, onSubmit]);

  return (
    <div className={css.wrap}>
      <div className={css.line}>
        <div className={css.back} onClick={() => router.back()}>
          <img src="/img/icons/back.svg" alt="back" />
        </div>

        <div className={css.setting} onClick={() => setShowModal(true)}>
          <img src="/img/icons/setting.svg" alt="setting" />
        </div>
      </div>

      {isDesktopOrLaptop ? <ViewTypeSelect /> : ""}

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className={css.modal}>
          <h4 className="no-disable">{t("settings")}</h4>
          <p className="no-disable">{t("activation")}:</p>

          <div className={css.group}>
            <Switch
              color="green"
              handleChange={() => setChecked(!checked)}
              value={checked}
              label={value ? t("is_active") : "Zimmer ist deaktiviert"}
            />
          </div>

          <Button color="yellow" disabled={loading} onClick={submit}>
            {t("save")}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Setting;
