import type { NextPage } from 'next'
import { useEffect } from "react";
import Router from "next/router";

const IndexPage: NextPage = () => {
  const router = Router;

  useEffect(() => {
    router.push({pathname: 'customers'})
  }, [router]);

  return <></>
}

export default IndexPage;
