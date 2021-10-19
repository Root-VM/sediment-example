import React, { FC } from 'react';
import { useTranslations } from "next-intl";

import css from './404.module.scss';

const NotFoundPage: FC = () => {
  const t = useTranslations('common');

  return (
    <section className={ css.box}>
      <img src="/img/sad-smile.png" alt="sad" />
      <p>{t('not_exist')}</p>
    </section>
  );
};

export function getStaticProps({ locale }: { locale: any }) {
  return { props: {
      messages: require(`../../locales/${locale}/common.json`),
    }};
}
export default NotFoundPage;
