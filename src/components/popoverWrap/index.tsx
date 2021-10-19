import React, { FC, useState } from "react";
import { Popover } from "react-tiny-popover";
import { motion, AnimatePresence } from "framer-motion";

const PopoverWrap: FC<{ text: any; disableAutoHidden?: boolean }> = ({
  text,
  disableAutoHidden,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);

    if (!disableAutoHidden) {
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  return (
    <Popover
      isOpen={true}
      positions={["right", "top", "bottom"]}
      content={
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {text}
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <div onClick={toggle}>{children}</div>
    </Popover>
  );
};

export default PopoverWrap;
