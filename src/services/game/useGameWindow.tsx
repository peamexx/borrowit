import { useCallback, useRef } from "react";

import { getApi, API_KEY } from '@services/api/api';
import { useAuthStore } from "@services/auth/userStore";

export const useGameWindow = () => {
  const { user } = useAuthStore();
  const windowMap = useRef<Map<number, Window>>(new Map());

  const openGameWindow = useCallback((book: { itemId: number }) => {
    const url = book.itemId % 2 === 0 ? `/game/frame.html?id=${book.itemId}` : `/game-string/frame.html?id=${book.itemId}`;
    const openWindow = window.open(url, "game-quiz", "_blank");
    if (!openWindow) return;

    windowMap.current.set(book.itemId, openWindow);

    // 창 닫혔는 지 0.5초씩 체크
    const timer = setInterval(async () => {
      if (openWindow.closed) {
        await getApi(API_KEY.CREATE_GAME_RESULT_DATA, { type: "close", itemId: book.itemId, user, });

        windowMap.current.delete(book.itemId);
        window.removeEventListener("message", handler);
        clearInterval(timer);
      }
    }, 500);

    const handler = async (event: any) => {
      if (event.origin !== window.location.origin || !event.data?.type) return;

      switch (event.data.type) {
        case "load":
          await getApi(API_KEY.CREATE_GAME_DATA, { itemId: book.itemId, answer: event.data.answer, });

          openWindow.postMessage({ itemId: book.itemId }, window.location.origin);
          break;

        case "start":
          await getApi(API_KEY.CREATE_GAME_RESULT_DATA, { type: event.data.type, itemId: event.data.itemId, user });
          break;

        case "short":
        case "multi":
        case "ox":
          await getApi(API_KEY.CREATE_GAME_RESULT_DATA, { ...event.data, user });
          break;
      }
    };
    window.addEventListener("message", handler);
  },
    [getApi, API_KEY, user]
  );

  return { openGameWindow };
}