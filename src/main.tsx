import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import { RouterProvider } from "react-router";
import { router } from './routes/router';

createRoot(document.getElementById('root')!).render(
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
)
