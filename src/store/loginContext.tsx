import React from "react";
import { useCookies } from 'react-cookie';
type TContext = {
  isLogin: boolean;
};
const LoginContext = React.createContext<TContext>({
  isLogin: false,
});
interface Props {
    children?: React.ReactNode
}
export const LoginContextProvider: React.FC = ({children}: Props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    console.log(setCookie,removeCookie);
    const loginValue: TContext = {
        isLogin: cookies?.accessToken ? true : false,
    };

  return (
    <LoginContext.Provider value={loginValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;