import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TokenProvider from "../providers/tokenProvider";

export const AuthGuard: React.FC<any> = ({ children }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = TokenProvider.getToken();

    if (token) {
      setShow(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  return <>{show ? children : ""}</>;
};
