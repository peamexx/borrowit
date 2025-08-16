import { createContext, useContext, useRef } from "react";
import { Toast } from 'primereact/toast';

interface ToastContextType {
  openToast: (params: any) => void;
}

const ToastContext = createContext<ToastContextType>({
  openToast: () => { },
});

export function ToastProvider({ children }: any) {
  const toast = useRef<any>(null);

  const openToast = (params: any) => {
    toast.current?.show({ ...params });
  }

  return (
    <ToastContext.Provider value={{ openToast }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}