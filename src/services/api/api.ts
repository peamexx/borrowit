import { doc, collection, query, where, getDocs, getDoc, addDoc } from "firebase/firestore";

import { db } from "@services/firebase/firebase";
import type { User } from "@services/auth/userStore";

export const API_KEY = {
  GET_DUELIST: 'GET_DUELIST',
  GET_DUELIST_ALL_USERS: 'GET_DUELIST_ALL_USERS',
  CREATE_BORROW_BOOK: 'CREATE_BORROW_BOOK',
  CHECK_IS_BOOK_BORROWED: 'CHECK_IS_BOOK_BORROWED',
}

export interface ApiType {
  success: boolean;
  data?: any;
  code?: string;
  message?: string;
}

export const getApi = async (key: string, options: any = {}, timeout = 3000) => {
  const timeoutPromise: Promise<ApiType> = new Promise((_, reject) => {
    return setTimeout(() => reject({ success: false, code: 'TIMEOUT' }), timeout);
  });

  let fetchPromise: Promise<ApiType>;
  switch (key) {
    case 'GET_DUELIST':
      fetchPromise = getDueListUser({ ...options });
      break;
    case 'GET_DUELIST_ALL_USERS':
      fetchPromise = getDueListAllUsers({ ...options });
      break;
    case 'CREATE_BORROW_BOOK':
      fetchPromise = createBorrowBook({ ...options });
      break;
    case 'CHECK_IS_BOOK_BORROWED':
      fetchPromise = checkIsBookBorrowed({ ...options });
      break;
  }

  //@ts-ignore
  return Promise.race<ApiType>([fetchPromise, timeoutPromise]);
}

export const getDueListUser = async (user: User) => {
  try {
    const dueQuery = query(
      collection(db, "due_master"),
      where("memberRef", "==", doc(db, user.userRefStr)),
    );
    const dueSnapshot = await getDocs(dueQuery);
    if (dueSnapshot.empty) {
      return { success: true, code: "EMPTY", data: [], message: `대출 목록에 해당 user의 데이터가 없음.` };
    }

    let returnArr = [];
    for (const item of dueSnapshot.docs) {
      const d = item.data();
      returnArr.push(({
        ...d,
        dday: _getDday(d.endDate)
      }));
    }
    return { success: true, data: returnArr };
  } catch (error) {
    console.debug('error', error);
    return { success: false, code: 'ERROR', data: error };
  }
}

export const getDueListAllUsers = async (user: User) => {
  try {
    // 1. 오늘 날짜 이후 데이터 조회
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10); // ex. "2025-08-13"

    const dueQuery = query(
      collection(db, "due_master"),
      where("companyRef", "==", doc(db, user.companyRefStr)),
      where("endDate", "<", todayStr),
    );
    const dueSnapshot = await getDocs(dueQuery);
    if (dueSnapshot.empty) {
      return { success: true, code: "EMPTY", data: [], message: `데이터 없음.` };
    }

    let returnArr = [];
    for (const item of dueSnapshot.docs) {
      const d = item.data();
      const memberSnap = await getDoc(doc(db, "member_master", d.memberRef.id));
      returnArr.push(({
        ...d,
        username: memberSnap.exists() ? memberSnap.data().username : '',
        dday: _getDday(d.endDate)
      }));
    }
    return { success: true, data: returnArr };
  } catch (error) {
    console.debug('error', error);
    return { success: false, code: 'ERROR', data: error };
  }
}

interface CreateBorrowBookType {
  title: string;
  itemId: string;
  user: User
}
export const createBorrowBook = async ({ title, itemId, user }: CreateBorrowBookType): Promise<ApiType> => {
  try {
    // 1. 중복 체크
    const list = collection(db, "due_master");
    const q = query(list, where("itemId", "==", itemId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, code: "DUPLICATE", message: `itemId ${itemId} 이미 존재함.` };
    }

    // 2. 저장
    const memberRef = doc(db, user.userRefStr);
    const companyRef = doc(db, user.companyRefStr);
    const today = new Date();
    let endDay = new Date(today);
    endDay.setDate(today.getDate() + 10);

    const res = await addDoc(collection(db, "due_master"), {
      title: title,
      itemId: itemId,
      memberRef: memberRef,
      companyRef: companyRef,
      createDate: today.toISOString().split('T')[0],
      endDate: endDay.toISOString().split('T')[0],
    });
    if (res) {
      return { success: true };
    }
    return { success: false }
  } catch (error) {
    console.debug('error', error);
    return { success: false, code: 'ERROR', data: error };
  }
}

export const checkIsBookBorrowed = async ({ bookArr }: any) => {
  try {
    const itemIds = bookArr.map((i: any) => i.itemId);

    // 파이어베이스에서 in쿼리 쓰려면 10개씩 나눠야함.
    const chunks = [];
    for (let i = 0; i < itemIds.length; i += 10) {
      chunks.push(itemIds.slice(i, i + 10));
    }

    const borrowSet = new Set();
    for (const chunk of chunks) {
      const q = query(collection(db, "due_master"), where("itemId", "in", chunk));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        borrowSet.add(doc.data().itemId);
      });
    }

    const resultArr = bookArr.map((item: any) => ({
      itemId: item.itemId,
      isBorrowed: borrowSet.has(item.itemId),
    }));
    return { success: true, data: resultArr };
  } catch (error) {
    console.debug('error', error);
    return { success: false, code: 'ERROR', data: error };
  }
}

function _getDday(targetDateStr: string): string {
  const today = new Date();
  const [year, month, day] = targetDateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day); // 로컬 타임 기준

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `-${diffDays}`;
  if (diffDays === 0) return '0';
  return `+${Math.abs(diffDays)}`;
}