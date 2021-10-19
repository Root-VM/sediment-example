import React, { FC, useState } from "react";
import { Popover } from "react-tiny-popover";
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl";

import css from "./toCopyText.module.scss";

const ToCopyElement: FC<{text: string}> = ({text}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');

  const copy = () => {
    setIsOpen(true)
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setTimeout(() => setIsOpen(false), 2000);
  }

  return (
    <Popover  isOpen={true}
              positions={['right', 'top', 'bottom']}
              content={
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                    >{t('copied')}</motion.div>
                  )}
                </AnimatePresence>
              }
    >
      <img onClick={copy} className={css.img} alt="check" src="/img/icons/copy.svg" />
    </Popover>
  );
};

export default ToCopyElement;