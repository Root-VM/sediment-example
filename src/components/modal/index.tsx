import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import css from "./modal.module.scss";

interface PropsInterface {
  isVisible: boolean;
  onClose?: () => void;
}

const Modal: FC<PropsInterface> = ({
  isVisible = false,
  onClose,
  children,
}) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 960px)"
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
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
