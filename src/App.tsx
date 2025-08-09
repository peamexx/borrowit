import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './assets/styles/common/global/global.css';

import { lazy } from 'react';
import { Outlet } from 'react-router';

const CustomHeader = lazy(() => import('virtual:client-header'));
const CustomMenu = lazy(() => import('virtual:client-menu'));

function App() {
  return (
    <>
      <CustomHeader />
      <div id='container'>
        <CustomMenu />
        <Outlet />
      </div>
    </>
  )
}

export default App
