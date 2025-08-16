import { lazy } from 'react';
import { useTitle } from '@services/title/useTitle';

const CustomLogin = lazy(() => import('virtual:client-login'));

function Login() {
  useTitle();
  
  return (
    <CustomLogin />
  )
}

export default Login