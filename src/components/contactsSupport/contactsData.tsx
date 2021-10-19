import React, { FC } from "react";
import classNames from "classnames";
import Image from "next/image";
import ToCopyElement from "../toCopyText";

import css from "./contactsSupport.module.scss";

const ContactsData: FC<{ inputsStyle?: boolean }> = ({ inputsStyle }) => {
  return (
    <ul className={classNames(css.csElements, inputsStyle && css.inputsStyle)}>
      <li>
        <Image
          width={18}
          height={14.65}
          alt="check"
          src="/img/icons/mail.svg"
        />
        <div>
          <a href="mailto:support@sedimentum.com">support@sedimentum.com</a>
          <ToCopyElement text="support@sedimentum.com" />
        </div>
      </li>
      <li>
        <Image width={16} height={16} alt="check" src="/img/icons/phone.svg" />

        <div>
          <a href="tel:+41789133665">+41 78 913 36 65</a>
          <ToCopyElement text="+41 78 913 36 65" />
        </div>
      </li>
    </ul>
  );
};

export default ContactsData;
