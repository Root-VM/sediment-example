import React, { FC, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "../ui/button";
import SupportModal from "./supportModal";

import css from "./contactsSupport.module.scss";

const ContactsSupport: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations("support");

  return (
    <div className={css.wrap}>
      <Button color="red" onClick={() => setShowModal(true)}>
        <Image
          width={14}
          height={14}
          alt="headphones "
          src="/img/icons/headphones.svg"
        />
        <span>{t("contacts_support")}</span>
      </Button>

      <p>{t("address")}</p>

      <SupportModal isVisible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ContactsSupport;
