import React, { FC } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import ContactsData from "./contactsData";

import css from "./contactsSupport.module.scss";

interface PropsInterface {
  isVisible: boolean;
  onClose?: () => void;
}

const SupportModal: FC<PropsInterface> = ({ isVisible = false, onClose }) => {
  const t = useTranslations("support");
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)",
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={css.modalWrap}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={css.bg}
            onClick={onClose}
          />

          <motion.div
            initial={!isDesktopOrLaptop ? { y: 1000 } : { opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={!isDesktopOrLaptop ? { y: 1000 } : { opacity: 0 }}
            transition={{ type: "keyframes", duration: 0.5 }}
            className={css.block}
          >
            <div className={css.close}>
              <img src="/img/icons/close.svg" onClick={onClose} alt="close" />
            </div>

            <h4>{t("contacts_support")}</h4>
            <p>
              {t("have_question1")} <br /> {t("have_question2")}
            </p>

            <ContactsData />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
