import { lazy } from 'react';

const CustomMain = lazy(() => import('virtual:client-main'));

function Main() {
  return (
    <CustomMain />
  )
}

export default Main