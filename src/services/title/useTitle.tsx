import { useEffect } from "react";

export const useTitle = () => {
  useEffect(() => {
    const title = document.querySelector('title');
    if (title) {
      title.innerHTML = `${import.meta.env.VITE_CLIENT || 'default'}-services`;
    }
  }, [])
  return null;
}