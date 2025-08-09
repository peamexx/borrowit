import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './assets/styles/common/global/global.css';

import { lazy } from 'react';
const CustomHeader = lazy(() => import('virtual:client-header'));

function App() {
  return (
    <>
      <CustomHeader />
    </>
  )
}

export default App
