import { lazy } from 'react';

const CustomLogin = lazy(() => import('virtual:client-login'));

function Login() {
  return (
    <CustomLogin />
  )
}

export default Login