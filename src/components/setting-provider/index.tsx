import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TokenProvider from "../../providers/tokenProvider";
import { RootState } from "../../store";

const SettingsProvider: FC = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const tokenType: boolean = useSelector(
    (state: RootState) => state.common.stayLogin
  );

  useEffect(() => {
    TokenProvider.init(tokenType);
    setLoaded(true);
  }, [tokenType]);

  return <>{loaded && children}</>;
};

export default SettingsProvider;
