import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider } from "react-router";
import { router } from './routes/router';
import { ToastProvider } from '@services/toast/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </PrimeReactProvider>
)
